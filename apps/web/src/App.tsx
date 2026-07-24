import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { isLoggedIn } from "./api/client";
import { AuthScreen } from "./screens/AuthScreen";
import { MainShell } from "./screens/MainShell";
import { ReconsentGate } from "./components/ReconsentGate";

/**
 * Tema MD3: modo escuro por padrão (uso noturno — §1.3), base 360px,
 * alvos de toque ≥ 48dp.
 */
const theme = createTheme({
  palette: { mode: "dark", primary: { main: "#90CAF9" } },
  shape: { borderRadius: 16 },
});

export function App() {
  const [logado, setLogado] = useState<boolean>(() => isLoggedIn());

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {logado ? (
        <ReconsentGate>
          <MainShell onLogout={() => setLogado(false)} />
        </ReconsentGate>
      ) : (
        <AuthScreen onDone={() => setLogado(true)} />
      )}
    </ThemeProvider>
  );
}
