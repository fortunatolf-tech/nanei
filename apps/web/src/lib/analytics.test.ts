import { describe, expect, it } from "vitest";
import type { Event } from "@nanei/contracts";
import { agregarPorDia, resumoJanela } from "./analytics";

function ev(
  tipo: Event["tipo"],
  payload: Record<string, unknown>,
  quando: Date,
): Event {
  return {
    id: "x",
    babyId: "b",
    tipo,
    inicio: quando.toISOString(),
    payload,
    criadoPor: "l",
    criadoEm: quando.toISOString(),
  };
}

describe("agregarPorDia", () => {
  const hoje = new Date();
  hoje.setHours(10, 0, 0, 0);
  const ontem = new Date(hoje);
  ontem.setDate(ontem.getDate() - 1);
  const antigo = new Date(hoje);
  antigo.setDate(antigo.getDate() - 30);

  const events = [
    ev("sono", { minutos: 120, tipo: "soneca" }, hoje),
    ev("sono", { minutos: 60, tipo: "soneca" }, hoje),
    ev("mamada", { duracaoE: 300, duracaoD: 120, ultimoLado: "D" }, hoje),
    ev("mamadeira", { ml: 120, tipo: "formula" }, ontem),
    ev("fralda", { tipo: "ambos" }, ontem),
    ev("fralda", { tipo: "xixi" }, ontem),
    ev("sono", { minutos: 999 }, antigo),
  ];

  const dias = agregarPorDia(events, 7);

  it("retorna um ponto por dia da janela, sem buracos", () => {
    expect(dias).toHaveLength(7);
  });

  it("soma sono e conta mamadas do dia", () => {
    const d = dias[dias.length - 1];
    expect(d.sonoMin).toBe(180);
    expect(d.mamadas).toBe(1);
    expect(d.peitoMin).toBe(7); // 420s → 7 min
  });

  it("agrega fraldas e mamadeira do dia anterior", () => {
    const d = dias[dias.length - 2];
    expect(d.fraldas).toBe(2);
    expect(d.mamadeiraMl).toBe(120);
  });

  it("ignora eventos fora da janela de 7 dias", () => {
    const somaSono = dias.reduce((a, d) => a + d.sonoMin, 0);
    expect(somaSono).toBe(180); // o evento de 30 dias atrás fica de fora
  });
});

describe("resumoJanela", () => {
  it("calcula médias diárias na janela", () => {
    const hoje = new Date();
    hoje.setHours(10, 0, 0, 0);
    const dias = agregarPorDia(
      [
        ev("fralda", { tipo: "xixi" }, hoje),
        ev("fralda", { tipo: "coco" }, hoje),
      ],
      7,
    );
    const r = resumoJanela(dias);
    expect(r.fraldasMediaDia).toBeCloseTo(2 / 7, 1);
  });
});
