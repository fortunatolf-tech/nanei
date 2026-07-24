import type { Baby, Event, TipoEvento } from "@nanei/contracts";
import { api } from "./client";

export function listBabies(): Promise<Baby[]> {
  return api<Baby[]>("/babies");
}

export interface NewEventInput {
  tipo: TipoEvento;
  inicio: string;
  fim?: string;
  payload: Record<string, unknown>;
}

export function listEvents(babyId: string): Promise<Event[]> {
  return api<Event[]>(`/babies/${babyId}/events`);
}

export function createEvent(
  babyId: string,
  input: NewEventInput,
  idempotencyKey: string,
): Promise<Event> {
  return api<Event>(`/babies/${babyId}/events`, {
    method: "POST",
    body: input,
    headers: { "idempotency-key": idempotencyKey },
  });
}

export function deleteEvent(babyId: string, eventId: string): Promise<void> {
  return api<void>(`/babies/${babyId}/events/${eventId}`, { method: "DELETE" });
}
