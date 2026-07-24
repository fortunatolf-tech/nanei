import type { Event, TipoEvento } from "@nanei/contracts";
import { createEvent, deleteEvent, listEvents } from "../api/babies";
import { ApiError } from "../api/client";

/**
 * Store de eventos offline-first (RNF-03). Cada registro nasce local com um
 * `idempotencyKey` que também é a chave de sync: a fila é reenviada ao
 * reconectar e o backend deduplica pela mesma chave (§4.4). Enquanto o
 * registro não confirma no servidor, ele já aparece na linha do tempo.
 */
const QUEUE_KEY = "nanei.queue.v1";
const CACHE_KEY = "nanei.eventcache.v1";

/** Registro local: espelha Event e acrescenta estado de sincronização. */
export interface LocalEvent extends Event {
  idempotencyKey: string;
  /** id atribuído pelo servidor após confirmação (usado no DELETE) */
  serverId?: string;
  /** false enquanto não confirmado no servidor */
  synced: boolean;
  /** marca exclusão pendente de sync */
  deleted?: boolean;
}

type Listener = () => void;
const listeners = new Set<Listener>();

/**
 * Snapshot memoizado para useSyncExternalStore: a referência só muda quando
 * os dados mudam (via emit), evitando loop de renderização no React.
 */
let snapshot: LocalEvent[] = computeEvents();

function emit() {
  snapshot = computeEvents();
  for (const l of listeners) l();
}

export function subscribe(l: Listener): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

function load(key: string): LocalEvent[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "[]") as LocalEvent[];
  } catch {
    return [];
  }
}

function saveQueue(items: LocalEvent[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

function saveCache(items: LocalEvent[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(items));
}

/** Eventos confirmados (cache do servidor) + pendentes na fila, unificados. */
function computeEvents(): LocalEvent[] {
  const cache = load(CACHE_KEY);
  const queue = load(QUEUE_KEY);
  const byKey = new Map<string, LocalEvent>();
  for (const e of cache) byKey.set(e.idempotencyKey, e);
  for (const e of queue) byKey.set(e.idempotencyKey, e); // fila sobrepõe cache
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
): LocalEvent {
  const key = crypto.randomUUID();
  const ev: LocalEvent = {
    id: key,
    idempotencyKey: key,
    babyId: "",
    tipo,
    inicio: inicio.toISOString(),
    fim: fim?.toISOString(),
    payload,
    criadoPor: "local",
    criadoEm: new Date().toISOString(),
    synced: false,
  };
  const queue = load(QUEUE_KEY);
  queue.push(ev);
  saveQueue(queue);
  emit();
  void sync();
  return ev;
}

export function removeLocal(idempotencyKey: string) {
  const queue = load(QUEUE_KEY);
  const naFila = queue.find((e) => e.idempotencyKey === idempotencyKey);
  if (naFila && !naFila.synced) {
    // Ainda não subiu: some sem deixar rastro.
    saveQueue(queue.filter((e) => e.idempotencyKey !== idempotencyKey));
  } else {
    // Já confirmado: marca exclusão pendente para o sync propagar.
    const existente = naFila ?? {
      ...load(CACHE_KEY).find((e) => e.idempotencyKey === idempotencyKey)!,
    };
    if (!existente) return;
    saveQueue([
      ...queue.filter((e) => e.idempotencyKey !== idempotencyKey),
      { ...existente, deleted: true },
    ]);
  }
  emit();
  void sync();
}

let syncing = false;

/** Reenvia a fila e recarrega o cache do servidor. Silencioso se offline. */
export async function sync(babyIdHint?: string): Promise<void> {
  if (syncing || !navigator.onLine) return;
  syncing = true;
  try {
    const babyId = babyIdHint ?? (await resolveBabyId());
    if (!babyId) return;

    let queue = load(QUEUE_KEY);
    for (const ev of queue) {
      try {
        if (ev.deleted) {
          if (ev.serverId) await deleteEvent(babyId, ev.serverId);
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
        // Sucesso: remove da fila.
        queue = queue.filter((e) => e.idempotencyKey !== ev.idempotencyKey);
        saveQueue(queue);
      } catch (e) {
        // 4xx (ex.: sem permissão) não adianta reter; 5xx/rede mantém na fila.
        if (e instanceof ApiError && e.status >= 400 && e.status < 500) {
          queue = queue.filter((x) => x.idempotencyKey !== ev.idempotencyKey);
          saveQueue(queue);
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
    saveCache(cache);
    emit();
  } catch {
    /* offline ou sessão inválida: mantém estado local */
  } finally {
    syncing = false;
  }
}

let babyIdCache: string | null = null;

async function resolveBabyId(): Promise<string | null> {
  if (babyIdCache) return babyIdCache;
  const { listBabies } = await import("../api/babies");
  const babies = await listBabies();
  babyIdCache = babies[0]?.id ?? null;
  return babyIdCache;
}

export function resetBabyCache() {
  babyIdCache = null;
}

// Sincroniza ao voltar a ficar online.
if (typeof window !== "undefined") {
  window.addEventListener("online", () => void sync());
}
