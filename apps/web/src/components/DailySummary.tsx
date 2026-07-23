import type { Event } from "@nanei/contracts";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { fmtDuracao } from "../lib/format";

/** Resumo automático do dia (RF-ANA-01). */
export function DailySummary({ events }: { events: Event[] }) {
  const mamadas = events.filter((e) => e.tipo === "mamada");
  const segPeito = mamadas.reduce((acc, e) => {
    const p = e.payload as Record<string, unknown>;
    return acc + Number(p.duracaoE ?? 0) + Number(p.duracaoD ?? 0);
  }, 0);
  const ml = events
    .filter((e) => e.tipo === "mamadeira")
    .reduce((acc, e) => acc + Number((e.payload as Record<string, unknown>).ml ?? 0), 0);
  const fraldas = events.filter((e) => e.tipo === "fralda").length;
  const minSono = events
    .filter((e) => e.tipo === "sono")
    .reduce((acc, e) => acc + Number((e.payload as Record<string, unknown>).minutos ?? 0), 0);

  const itens = [
    { rotulo: "Mamadas", valor: mamadas.length > 0 ? `${mamadas.length} · ${fmtDuracao(segPeito)}` : "0" },
    { rotulo: "Mamadeira", valor: `${ml} ml` },
    { rotulo: "Fraldas", valor: String(fraldas) },
    { rotulo: "Sono", valor: fmtDuracao(minSono * 60) },
  ];

  return (
    <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 0.5 }}>
      {itens.map((i) => (
        <Paper key={i.rotulo} variant="outlined" sx={{ px: 1.5, py: 1, minWidth: 92, flexShrink: 0 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            {i.rotulo}
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {i.valor}
          </Typography>
        </Paper>
      ))}
    </Stack>
  );
}
