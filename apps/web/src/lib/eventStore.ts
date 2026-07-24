import type { Event, TipoEvento } from "@nanei/contracts";
import { createEvent, deleteEvent, editEvent, listEvents } from "../api/babies";
import { ApiError } from "../api/client";

/**
 * Store de eventos offline-first (RNF-03), por bebê (RF-FAM-01). Cada registro
 * nasce local com um `idempotencyKey` que também é a chave de sync: a fila é
 * reenviada ao reconectar e o backend deduplica pela mesma chave (§4.4).
 * Enquanto o registro não confirma no servidor, ele já aparece na linha do
 * tempo. Fila e cache são segregados por bebê, então cada um tem seus dados.
 */
function queueKey(babyId: string) {
  return `nanei.queue.v2.${babyId}`;
}
function cacheKey(babyId: string) {
  return `nanei.cache.v2.${babyId}`;
}

/** Registro local: espelha Event e acrescenta estado de sincronização. */
export interface LocalEvent extends Event {
  idempotencyKey: string;
  /** id atribuído pelo servidor após confirmação (usado no PATCH/DELETE) */
  serverId?: string;
  /** false enquanto não confirmado no servidor */
  synced: boolean;
  /** marca edição pendente de sync (RF-TRK-14) */
  edited?: boolean;
  /** marca exclusão pendente de sync */
  deleted?: boolean;
}

/** Campos editáveis de um registro (RF-TRK-14). */
export interface EventEdit {
  inicio?: string;
  fim?: string | null;
  payload?: Record<string, unknown>;
}

/** Bebê cujos eventos estão em foco. Definido pelo babyStore. */
let activeBabyId: string | null = null;

type Listener = () => void;
const listeners = new Set<Listener>();

let snapshot: LocalEvent[] = [];

function emit() {
  snapshot = computeEvents();
  for (const l of listeners) l();
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Troca o bebê ativo (RF-FAM-01) e recarrega o snapshot correspondente. */
export function setActiveBaby(babyId: string | null) {
  if (activeBabyId === babyId) return;
  activeBabyId = babyId;
  emit();
  if (babyId) void sync();
}

function load(key: string): LocalEvent[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]") as LocalEvent[];
  } catch {
    return [];
  }
}

function loadQueue(): LocalEvent[] {
  return activeBabyId ? load(queueKey(activeBabyId)) : [];
}

function loadCache(): LocalEvent[] {
  return activeBabyId ? load(cacheKey(activeBabyId)) : [];
}

function saveQueue(items: LocalEvent[]) {
  if (activeBabyId) localStorage.setItem(queueKey(activeBabyId), JSON.stringify(items));
}

function saveCache(items: LocalEvent[]) {
  if (activeBabyId) localStorage.setItem(cacheKey(activeBabyId), JSON.stringify(items));
}

/** Eventos confirmados (cache do servidor) + pendentes na fila, unificados. */
function computeEvents(): LocalEvent[] {
  const byKey = new Map<string, LocalEvent>();
  for (const e of loadCache()) byKey.set(e.idempotencyKey, e);
  for (const e of loadQueue()) byKey.set(e.idempotencyKey, e); // fila sobrepõe cache
  return [...byKey.values()].filter((e) => !e.deleted);
}

/** Referência estável para useSyncExternalStore (atualizada em emit). */
export function getEvents(): LocalEvent[] {
  return snapshot;
}

export function addLocal(
  tipo: TipoEvento,
  payload: Record<string, unknown>,
  inicio: Date,
  fim?: Date,
): LocalEvent | null {
  if (!activeBabyId) return null;
  const key = crypto.randomUUID();
  const ev: LocalEvent = {
    id: key,
    idempotencyKey: key,
    babyId: activeBabyId,
    tipo,
    inicio: inicio.toISOString(),
    fim: fim?.toISOString(),
    payload,
    criadoPor: "local",
    criadoEm: new Date().toISOString(),
    synced: false,
  };
  saveQueue([...loadQueue(), ev]);
  emit();
  void sync();
  return ev;
}

/** Edita data/hora ou payload de um registro, com fila offline (RF-TRK-14). */
export function editLocal(idempotencyKey: string, edit: EventEdit) {
  const queue = loadQueue();
  const naFila = queue.find((e) => e.idempotencyKey === idempotencyKey);
  const base =
    naFila ?? loadCache().find((e) => e.idempotencyKey === idempotencyKey);
  if (!base || base.deleted) return;

  const atualizado: LocalEvent = {
    ...base,
    inicio: edit.inicio ?? base.inicio,
    fim: edit.fim === null ? undefined : (edit.fim ?? base.fim),
    payload: edit.payload ?? base.payload,
  };

  if (naFila && !naFila.synced) {
    // Ainda não subiu: mantém como criação, apenas com os novos valores.
    saveQueue(
      queue.map((e) => (e.idempotencyKey === idempotencyKey ? atualizado : e)),
    );
  } else {
    // Já confirmado: enfileira uma edição pendente.
    saveQueue([
      ...queue.filter((e) => e.idempotencyKey !== idempotencyKey),
      { ...atualizado, synced: true, edited: true },
    ]);
  }
  emit();
  void sync();
}

export function removeLocal(idempotencyKey: string) {
  const queue = loadQueue();
  const naFila = queue.find((e) => e.idempotencyKey === idempotencyKey);
  if (naFila && !naFila.synced) {
    // Ainda não subiu: some sem deixar rastro.
    saveQueue(queue.filter((e) => e.idempotencyKey !== idempotencyKey));
  } else {
    const existente =
      naFila ?? loadCache().find((e) => e.idempotencyKey === idempotencyKey);
    if (!existente) return;
    // Já confirmado: marca exclusão pendente para o sync propagar.
    saveQueue([
      ...queue.filter((e) => e.idempotencyKey !== idempotencyKey),
      { ...existente, deleted: true },
    ]);
  }
  emit();
  void sync();
}

let syncing = false;

/** Reenvia a fila e recarrega o cache do bebê ativo. Silencioso se offline. */
export async function sync(): Promise<void> {
  const babyId = activeBabyId;
  if (syncing || !babyId || !navigator.onLine) return;
  syncing = true;
  try {
    let queue = load(queueKey(babyId));
    for (const ev of queue) {
      try {
        if (ev.deleted) {
          if (ev.serverId) await deleteEvent(babyId, ev.serverId);
        } else if (ev.edited) {
          if (ev.serverId) {
            await editEvent(babyId, ev.serverId, {
              inicio: ev.inicio,
              fim: ev.fim,
              payload: ev.payload,
            });
          }
        } else if (!ev.synced) {
          await createEvent(
            babyId,
            {
              tipo: ev.tipo,
              inicio: ev.inicio,
              fim: ev.fim,
              payload: ev.payload,
            },
            ev.idempotencyKey,
          );
        }
        queue = queue.filter((e) => e.idempotencyKey !== ev.idempotencyKey);
        localStorage.setItem(queueKey(babyId), JSON.stringify(queue));
      } catch (e) {
        // 4xx (ex.: sem permissão) não adianta reter; 5xx/rede mantém na fila.
        if (e instanceof ApiError && e.status >= 400 && e.status < 500) {
          queue = queue.filter((x) => x.idempotencyKey !== ev.idempotencyKey);
          localStorage.setItem(queueKey(babyId), JSON.stringify(queue));
        } else {
          break; // provável rede: tenta tudo de novo na próxima
        }
      }
    }

    // Recarrega confirmados do servidor.
    const servidor = await listEvents(babyId);
    const cache: LocalEvent[] = servidor.map((e) => ({
      ...e,
      idempotencyKey: e.id,
      serverId: e.id,
      synced: true,
    }));
    localStorage.setItem(cacheKey(babyId), JSON.stringify(cache));
    // Só reflete na UI se ainda for o bebê em foco (evita corrida ao trocar).
    if (activeBabyId === babyId) emit();
  } catch {
    /* offline ou sessão inválida: mantém estado local */
  } finally {
    syncing = false;
  }
}

// Sincroniza ao voltar a ficar online.
if (typeof window !== "undefined") {
  window.addEventListener("online", () => void sync());
}
