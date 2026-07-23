import type { Event, TipoEvento } from "@nanei/contracts";

/**
 * Persistência local (demo do S1). No S4 este módulo vira a fila offline
 * com sync via idempotency-key (RNF-03); a interface pública se mantém.
 */
const EVENTS_KEY = "nanei.events.v1";
const BABY_KEY = "nanei.baby.v1";

export function loadEvents(): Event[] {
  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) ?? "[]") as Event[];
  } catch {
    return [];
  }
}

function saveEvents(events: Event[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function addEvent(
  tipo: TipoEvento,
  payload: Record<string, unknown>,
  inicio: Date,
  fim?: Date,
): Event {
  const event: Event = {
    id: crypto.randomUUID(),
    babyId: "local",
    tipo,
    inicio: inicio.toISOString(),
    fim: fim?.toISOString(),
    payload,
    criadoPor: "local",
    criadoEm: new Date().toISOString(),
  };
  const events = loadEvents();
  events.push(event);
  saveEvents(events);
  return event;
}

export function removeEvent(id: string) {
  saveEvents(loadEvents().filter((e) => e.id !== id));
}

export function eventsOfDay(events: Event[], day: Date): Event[] {
  const start = new Date(day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return events
    .filter((e) => {
      const t = new Date(e.inicio).getTime();
      return t >= start.getTime() && t < end.getTime();
    })
    .sort((a, b) => b.inicio.localeCompare(a.inicio));
}

export function getBabyName(): string | null {
  return localStorage.getItem(BABY_KEY);
}

export function setBabyName(nome: string) {
  localStorage.setItem(BABY_KEY, nome);
}
