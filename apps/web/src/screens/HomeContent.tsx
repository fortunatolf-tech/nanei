import { useMemo, useState, useSyncExternalStore } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import {
  addLocal,
  editLocal,
  getEvents,
  removeLocal,
  subscribe,
  type LocalEvent,
} from "../lib/eventStore";
import { eventsOfDay } from "../lib/storage";
import {
  BreastTimerDialog,
  type BreastResult,
} from "../components/BreastTimerDialog";
import { BottleDialog, DiaperDialog, SleepDialog } from "../components/QuickDialogs";
import { EditTimeDialog } from "../components/EditTimeDialog";
import { Timeline } from "../components/Timeline";
import { DailySummary } from "../components/DailySummary";

type Dialogo = null | "mamada" | "mamadeira" | "fralda" | "sono";

const CARDS: { id: Exclude<Dialogo, null>; icone: string; rotulo: string }[] = [
  { id: "mamada", icone: "🤱", rotulo: "Peito" },
  { id: "mamadeira", icone: "🍼", rotulo: "Mamadeira" },
  { id: "sono", icone: "💤", rotulo: "Sono" },
  { id: "fralda", icone: "🧷", rotulo: "Fralda" },
];

/** Conteúdo da aba Início: registro rápido, resumo do dia e linha do tempo. */
export function HomeContent() {
  const events = useSyncExternalStore(subscribe, getEvents);
  const [dialogo, setDialogo] = useState<Dialogo>(null);
  const [editando, setEditando] = useState<LocalEvent | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const hoje = useMemo(() => eventsOfDay(events, new Date()), [events]);

  const ladoSugerido: "E" | "D" = useMemo(() => {
    const ultima = [...events]
      .filter((e) => e.tipo === "mamada")
      .sort((a, b) => b.inicio.localeCompare(a.inicio))[0];
    const ultimo = (ultima?.payload as Record<string, unknown> | undefined)
      ?.ultimoLado;
    return ultimo === "E" ? "D" : "E";
  }, [events]);

  function registrou(msg: string) {
    setDialogo(null);
    setToast(msg);
  }

  function salvarMamada(r: BreastResult) {
    addLocal(
      "mamada",
      { duracaoE: r.duracaoE, duracaoD: r.duracaoD, ultimoLado: r.ultimoLado },
      r.inicio,
      r.fim,
    );
    registrou("Mamada registrada");
  }

  return (
    <>
      <Box sx={{ my: 1.5 }}>
        <DailySummary events={hoje} />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 1.5,
        }}
      >
        {CARDS.map((c) => (
          <Card key={c.id} variant="outlined">
            <CardActionArea
              onClick={() => setDialogo(c.id)}
              sx={{ p: 2, minHeight: 88, textAlign: "center" }}
            >
              <Typography variant="h4" component="span" display="block">
                {c.icone}
              </Typography>
              <Typography variant="body2">{c.rotulo}</Typography>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      <Divider sx={{ my: 2 }}>
        <Typography variant="overline" color="text.secondary">
          Hoje
        </Typography>
      </Divider>

      <Timeline
        events={hoje}
        onDelete={(id) => {
          removeLocal(id);
          setToast("Registro excluído");
        }}
        onEdit={(id) =>
          setEditando(events.find((e) => e.idempotencyKey === id) ?? null)
        }
      />

      <BreastTimerDialog
        open={dialogo === "mamada"}
        ladoSugerido={ladoSugerido}
        onClose={() => setDialogo(null)}
        onSave={salvarMamada}
      />
      <BottleDialog
        open={dialogo === "mamadeira"}
        onClose={() => setDialogo(null)}
        onSave={(ml, tipo, quando) => {
          addLocal("mamadeira", { ml, tipo }, quando);
          registrou("Mamadeira registrada");
        }}
      />
      <DiaperDialog
        open={dialogo === "fralda"}
        onClose={() => setDialogo(null)}
        onSave={(tipo, quando) => {
          addLocal("fralda", { tipo }, quando);
          registrou("Fralda registrada");
        }}
      />
      <SleepDialog
        open={dialogo === "sono"}
        onClose={() => setDialogo(null)}
        onSave={(minutos, tipo, fim) => {
          const inicio = new Date(fim.getTime() - minutos * 60_000);
          addLocal("sono", { minutos, tipo }, inicio, fim);
          registrou("Sono registrado");
        }}
      />

      <EditTimeDialog
        event={editando}
        onClose={() => setEditando(null)}
        onSave={(key, inicio, fim) => {
          editLocal(key, {
            inicio: inicio.toISOString(),
            fim: fim ? fim.toISOString() : null,
          });
          setEditando(null);
          setToast("Horário atualizado");
        }}
      />

      <Snackbar
        open={toast !== null}
        autoHideDuration={2500}
        onClose={() => setToast(null)}
        message={toast ?? ""}
      />
    </>
  );
}
