import type { Event } from "@nanei/contracts";

/** Ponto diário agregado para os gráficos de tendência (RF-ANA-02). */
export interface DiaAgregado {
  /** rótulo curto do dia, ex. "seg 21" */
  dia: string;
  /** chave ISO do dia (YYYY-MM-DD) para ordenação */
  chave: string;
  sonoMin: number;
  mamadas: number;
  peitoMin: number;
  mamadeiraMl: number;
  fraldas: number;
}

function chaveDia(d: Date): string {
  const off = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - off).toISOString().slice(0, 10);
}

const DIAS_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function rotulo(d: Date): string {
  return `${DIAS_SEMANA[d.getDay()]} ${d.getDate()}`;
}

/**
 * Agrega os eventos nos últimos `n` dias (incluindo hoje), um ponto por dia.
 * Dias sem registro entram zerados, para a tendência não ter buracos.
 */
export function agregarPorDia(events: Event[], n = 7): DiaAgregado[] {
  const base = new Map<string, DiaAgregado>();
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(d.getDate() - i);
    base.set(chaveDia(d), {
      dia: rotulo(d),
      chave: chaveDia(d),
      sonoMin: 0,
      mamadas: 0,
      peitoMin: 0,
      mamadeiraMl: 0,
      fraldas: 0,
    });
  }

  for (const e of events) {
    const k = chaveDia(new Date(e.inicio));
    const dia = base.get(k);
    if (!dia) continue; // fora da janela
    const p = e.payload as Record<string, unknown>;
    switch (e.tipo) {
      case "sono":
        dia.sonoMin += Number(p.minutos ?? 0);
        break;
      case "mamada":
        dia.mamadas += 1;
        dia.peitoMin += Math.round(
          (Number(p.duracaoE ?? 0) + Number(p.duracaoD ?? 0)) / 60,
        );
        break;
      case "mamadeira":
        dia.mamadeiraMl += Number(p.ml ?? 0);
        break;
      case "fralda":
        dia.fraldas += 1;
        break;
    }
  }

  return [...base.values()].sort((a, b) => a.chave.localeCompare(b.chave));
}

/** Totais e médias da janela — cabeçalho da aba Análises (RF-ANA-01 semanal). */
export function resumoJanela(dias: DiaAgregado[]) {
  const n = dias.length || 1;
  const somaSono = dias.reduce((a, d) => a + d.sonoMin, 0);
  const somaMamadas = dias.reduce((a, d) => a + d.mamadas, 0);
  const somaFraldas = dias.reduce((a, d) => a + d.fraldas, 0);
  return {
    sonoMedioMin: Math.round(somaSono / n),
    mamadasMediaDia: Math.round((somaMamadas / n) * 10) / 10,
    fraldasMediaDia: Math.round((somaFraldas / n) * 10) / 10,
  };
}
