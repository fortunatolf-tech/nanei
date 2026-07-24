export function fmtHora(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function fmtDuracao(totalSeg: number): string {
  const h = Math.floor(totalSeg / 3600);
  const m = Math.floor((totalSeg % 3600) / 60);
  const s = Math.floor(totalSeg % 60);
  if (h > 0) return `${h}h${String(m).padStart(2, "0")}`;
  if (m > 0) return `${m}min`;
  return `${s}s`;
}

export function fmtCrono(totalSeg: number): string {
  const m = Math.floor(totalSeg / 60);
  const s = Math.floor(totalSeg % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Date → valor de <input type="datetime-local"> (horário local, sem fuso). */
export function toLocalInput(d: Date): string {
  const off = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}

/** Valor de datetime-local → Date (interpretado no fuso local). */
export function fromLocalInput(s: string): Date {
  return new Date(s);
}
