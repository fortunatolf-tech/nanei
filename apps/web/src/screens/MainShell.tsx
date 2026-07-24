import {
  lazy,
  Suspense,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { logout } from "../api/auth";
import { getEvents, subscribe } from "../lib/eventStore";
import {
  getBabyState,
  loadBabies,
  resetBabies,
  selectBaby,
  subscribeBabies,
} from "../lib/babyStore";
import { TopBar } from "../components/TopBar";
import { BottomNav, type Aba } from "../components/BottomNav";
import { AddBabyDialog } from "../components/AddBabyDialog";
import { HomeContent } from "./HomeContent";

// Recharts é pesado: carrega só quando a aba Análises é aberta (RNF-02).
const AnalyticsContent = lazy(() =>
  import("./AnalyticsContent").then((m) => ({ default: m.AnalyticsContent })),
);

function useOnline(): boolean {
  return useSyncExternalStore(
    (cb) => {
      window.addEventListener("online", cb);
      window.addEventListener("offline", cb);
      return () => {
        window.removeEventListener("online", cb);
        window.removeEventListener("offline", cb);
      };
    },
    () => navigator.onLine,
  );
}

/** Casca da área logada: barra + abas (Início/Análises) + navegação inferior. */
export function MainShell({ onLogout }: { onLogout: () => void }) {
  const babyState = useSyncExternalStore(subscribeBabies, getBabyState);
  const events = useSyncExternalStore(subscribe, getEvents);
  const online = useOnline();
  const [aba, setAba] = useState<Aba>("home");
  const [addBaby, setAddBaby] = useState(false);

  useEffect(() => {
    void loadBabies();
  }, []);

  const semBebe = babyState.carregado && babyState.babies.length === 0;
  const pendentes = events.filter(
    (e) => (!e.synced || e.edited) && !e.deleted,
  ).length;

  function sair() {
    logout();
    resetBabies();
    onLogout();
  }

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <TopBar
        babies={babyState.babies}
        activeId={babyState.activeId}
        online={online}
        pendentes={pendentes}
        onSelect={selectBaby}
        onAdd={() => setAddBaby(true)}
        onLogout={sair}
      />

      <Container maxWidth="sm" sx={{ flexGrow: 1, pb: 2 }}>
        {semBebe ? (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Você ainda não tem nenhum bebê cadastrado.
            </Typography>
            <Button variant="contained" onClick={() => setAddBaby(true)}>
              Adicionar bebê
            </Button>
          </Box>
        ) : aba === "home" ? (
          <HomeContent />
        ) : (
          <Suspense
            fallback={
              <Box sx={{ textAlign: "center", py: 6 }}>
                <CircularProgress size={28} />
              </Box>
            }
          >
            <AnalyticsContent />
          </Suspense>
        )}
      </Container>

      {!semBebe && <BottomNav aba={aba} onChange={setAba} />}

      <AddBabyDialog
        open={addBaby || semBebe}
        obrigatorio={semBebe}
        onClose={() => setAddBaby(false)}
        onDone={() => setAddBaby(false)}
      />
    </Box>
  );
}
