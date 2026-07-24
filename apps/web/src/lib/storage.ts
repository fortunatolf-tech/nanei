import type { Event } from "@nanei/contracts";

/** Filtra os eventos de um dia, mais recentes primeiro. */
export function eventsOfDay<T extends Event>(events: T[], day: Date): T[] {
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
