import { useMemo, useSyncExternalStore } from "react";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getEvents, subscribe } from "../lib/eventStore";
import { agregarPorDia, resumoJanela } from "../lib/analytics";
import { fmtDuracao } from "../lib/format";

function Grafico({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactElement;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {titulo}
      </Typography>
      <Box sx={{ width: "100%", height: 180 }}>
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </Box>
    </Paper>
  );
}

/** Aba Análises: tendência dos últimos 7 dias (RF-ANA-02) + resumo semanal. */
export function AnalyticsContent() {
  const theme = useTheme();
  const events = useSyncExternalStore(subscribe, getEvents);
  const cor = theme.palette.primary.main;
  const grade = theme.palette.divider;
  const eixo = theme.palette.text.secondary;

  const dias = useMemo(() => agregarPorDia(events, 7), [events]);
  const resumo = useMemo(() => resumoJanela(dias), [dias]);
  const dadosSono = dias.map((d) => ({ dia: d.dia, horas: +(d.sonoMin / 60).toFixed(1) }));

  const tiles = [
    { rotulo: "Sono médio/dia", valor: fmtDuracao(resumo.sonoMedioMin * 60) },
    { rotulo: "Mamadas/dia", valor: String(resumo.mamadasMediaDia) },
    { rotulo: "Fraldas/dia", valor: String(resumo.fraldasMediaDia) },
  ];

  const temDados = events.length > 0;

  return (
    <Stack spacing={1.5} sx={{ pt: 1.5 }}>
      <Typography variant="h6" component="h2">
        Últimos 7 dias
      </Typography>

      <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 0.5 }}>
        {tiles.map((t) => (
          <Paper
            key={t.rotulo}
            variant="outlined"
            sx={{ px: 1.5, py: 1, minWidth: 110, flexShrink: 0 }}
          >
            <Typography variant="caption" color="text.secondary" display="block">
              {t.rotulo}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {t.valor}
            </Typography>
          </Paper>
        ))}
      </Stack>

      {!temDados && (
        <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
          Ainda não há registros suficientes para mostrar tendências. Comece a
          registrar na aba Início. 💙
        </Typography>
      )}

      <Grafico titulo="Sono por dia (horas)">
        <BarChart data={dadosSono}>
          <CartesianGrid strokeDasharray="3 3" stroke={grade} />
          <XAxis dataKey="dia" tick={{ fill: eixo, fontSize: 12 }} />
          <YAxis tick={{ fill: eixo, fontSize: 12 }} width={28} />
          <Tooltip
            contentStyle={{
              background: theme.palette.background.paper,
              border: `1px solid ${grade}`,
              borderRadius: 8,
            }}
          />
          <Bar dataKey="horas" fill={cor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </Grafico>

      <Grafico titulo="Mamadas por dia">
        <BarChart data={dias}>
          <CartesianGrid strokeDasharray="3 3" stroke={grade} />
          <XAxis dataKey="dia" tick={{ fill: eixo, fontSize: 12 }} />
          <YAxis tick={{ fill: eixo, fontSize: 12 }} width={28} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: theme.palette.background.paper,
              border: `1px solid ${grade}`,
              borderRadius: 8,
            }}
          />
          <Bar dataKey="mamadas" fill={cor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </Grafico>

      <Grafico titulo="Fraldas por dia">
        <LineChart data={dias}>
          <CartesianGrid strokeDasharray="3 3" stroke={grade} />
          <XAxis dataKey="dia" tick={{ fill: eixo, fontSize: 12 }} />
          <YAxis tick={{ fill: eixo, fontSize: 12 }} width={28} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              background: theme.palette.background.paper,
              border: `1px solid ${grade}`,
              borderRadius: 8,
            }}
          />
          <Line
            type="monotone"
            dataKey="fraldas"
            stroke={cor}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </Grafico>
    </Stack>
  );
}
