import { useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { isLoggedIn } from "./api/client";
import { AuthScreen } from "./screens/AuthScreen";
import { MainShell } from "./screens/MainShell";
import { InviteScreen } from "./screens/InviteScreen";
import { ReconsentGate } from "./components/ReconsentGate";

function tokenDeConviteDaUrl(): string | null {
  return new URLSearchParams(window.location.search).get("convite");
}

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
  const [convite, setConvite] = useState<string | null>(() =>
    tokenDeConviteDaUrl(),
  );

  function limparConvite() {
    const url = new URL(window.location.href);
    url.searchParams.delete("convite");
    window.history.replaceState({}, "", url.pathname + url.search);
    setConvite(null);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {convite ? (
        <InviteScreen
          token={convite}
          logado={logado}
          onLogin={() => setLogado(true)}
          onFinish={limparConvite}
        />
      ) : logado ? (
        <ReconsentGate>
          <MainShell onLogout={() => setLogado(false)} />
        </ReconsentGate>
      ) : (
        <AuthScreen onDone={() => setLogado(true)} />
      )}
    </ThemeProvider>
  );
}
