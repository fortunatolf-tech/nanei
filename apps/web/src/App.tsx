import { useMemo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Divider from "@mui/material/Divider";
import Snackbar from "@mui/material/Snackbar";
import Chip from "@mui/material/Chip";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { Event } from "@nanei/contracts";
import {
  addEvent,
  eventsOfDay,
  getBabyName,
  loadEvents,
  removeEvent,
  setBabyName,
} from "./lib/storage";
import { BreastTimerDialog, type BreastResult } from "./components/BreastTimerDialog";
import { BottleDialog, DiaperDialog, SleepDialog } from "./components/QuickDialogs";
import { Timeline } from "./components/Timeline";
import { DailySummary } from "./components/DailySummary";

/**
 * Tema MD3: modo escuro por padrão (uso noturno — §1.3), base 360px,
 * alvos de toque ≥ 48dp.
 */
const theme = createTheme({
  palette: { mode: "dark", primary: { main: "#90CAF9" } },
  shape: { borderRadius: 16 },
});

type Dialogo = null | "mamada" | "mamadeira" | "fralda" | "sono";

const CARDS: { id: Exclude<Dialogo, null>; icone: string; rotulo: string }[] = [
  { id: "mamada", icone: "🤱", rotulo: "Peito" },
  { id: "mamadeira", icone: "🍼", rotulo: "Mamadeira" },
  { id: "sono", icone: "💤", rotulo: "Sono" },
  { id: "fralda", icone: "🧷", rotulo: "Fralda" },
];

export function App() {
  const [events, setEvents] = useState<Event[]>(() => loadEvents());
  const [dialogo, setDialogo] = useState<Dialogo>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [nomeBebe, setNomeBebe] = useState<string | null>(() => getBabyName());

  const hoje = useMemo(() => eventsOfDay(events, new Date()), [events]);

  const ladoSugerido: "E" | "D" = useMemo(() => {
    const ultima = events
      .filter((e) => e.tipo === "mamada")
      .sort((a, b) => b.inicio.localeCompare(a.inicio))[0];
    const ultimo = (ultima?.payload as Record<string, unknown> | undefined)?.ultimoLado;
    return ultimo === "E" ? "D" : "E";
  }, [events]);

  function refresh(msg: string) {
    setEvents(loadEvents());
    setDialogo(null);
    setToast(msg);
  }

  function salvarMamada(r: BreastResult) {
    addEvent(
      "mamada",
      { duracaoE: r.duracaoE, duracaoD: r.duracaoD, ultimoLado: r.ultimoLado },
      r.inicio,
      r.fim,
    );
    refresh("Mamada registrada");
  }

  function pedirNome() {
    const nome = window.prompt("Como o bebê se chama?");
    if (nome?.trim()) {
      setBabyName(nome.trim());
      setNomeBebe(nome.trim());
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            nanei!
          </Typography>
          <Chip
            label={nomeBebe ?? "nome do bebê"}
            onClick={pedirNome}
            variant={nomeBebe ? "filled" : "outlined"}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pb: 6 }}>
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
            removeEvent(id);
            refresh("Registro excluído");
          }}
        />
      </Container>

      <BreastTimerDialog
        open={dialogo === "mamada"}
        ladoSugerido={ladoSugerido}
        onClose={() => setDialogo(null)}
        onSave={salvarMamada}
      />
      <BottleDialog
        open={dialogo === "mamadeira"}
        onClose={() => setDialogo(null)}
        onSave={(ml, tipo) => {
          addEvent("mamadeira", { ml, tipo }, new Date());
          refresh("Mamadeira registrada");
        }}
      />
      <DiaperDialog
        open={dialogo === "fralda"}
        onClose={() => setDialogo(null)}
        onSave={(tipo) => {
          addEvent("fralda", { tipo }, new Date());
          refresh("Fralda registrada");
        }}
      />
      <SleepDialog
        open={dialogo === "sono"}
        onClose={() => setDialogo(null)}
        onSave={(minutos, tipo) => {
          const fim = new Date();
          const inicio = new Date(fim.getTime() - minutos * 60_000);
          addEvent("sono", { minutos, tipo }, inicio, fim);
          refresh("Sono registrado");
        }}
      />

      <Snackbar
        open={toast !== null}
        autoHideDuration={2500}
        onClose={() => setToast(null)}
        message={toast ?? ""}
      />
    </ThemeProvider>
  );
}
