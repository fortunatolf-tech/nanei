import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { ApiError } from "../api/client";
import {
  aceitarConvite,
  getConviteInfo,
  rotuloPapel,
  type ConviteInfo,
} from "../api/families";
import { loadBabies } from "../lib/babyStore";
import { AuthScreen } from "./AuthScreen";

/**
 * Tela de aceite de convite de cuidador (RF-FAM-02, fluxo F4). Mostra a
 * família e o papel; se o convidado não estiver logado, oferece login/cadastro
 * (F1 reduzido — a conta é dele) e então entra na família.
 */
export function InviteScreen({
  token,
  logado,
  onLogin,
  onFinish,
}: {
  token: string;
  logado: boolean;
  onLogin: () => void;
  onFinish: () => void;
}) {
  const [info, setInfo] = useState<ConviteInfo | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [aceitando, setAceitando] = useState(false);
  const [mostrarAuth, setMostrarAuth] = useState(false);

  useEffect(() => {
    getConviteInfo(token)
      .then(setInfo)
      .catch(() => setInfo({ valido: false }));
  }, [token]);

  async function aceitar() {
    setAceitando(true);
    setErro(null);
    try {
      await aceitarConvite(token);
      await loadBabies();
      onFinish();
    } catch (e) {
      setErro(
        e instanceof ApiError ? e.message : "Não foi possível aceitar o convite.",
      );
    } finally {
      setAceitando(false);
    }
  }

  // Convidado ainda não autenticado: mostra login/cadastro da própria conta.
  if (logado === false && mostrarAuth) {
    return <AuthScreen onDone={onLogin} />;
  }

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 420 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" component="h1">
            nanei!
          </Typography>
          <Typography color="text.secondary">Convite de cuidador</Typography>
        </Box>

        {!info && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress size={26} />
          </Box>
        )}

        {info && !info.valido && (
          <>
            <Alert severity="warning">
              Este convite é inválido, expirou ou já foi utilizado.
            </Alert>
            <Button variant="contained" onClick={onFinish}>
              Ir para o app
            </Button>
          </>
        )}

        {info && info.valido && (
          <>
            <Alert severity="info">
              Você foi convidado(a) para a família{" "}
              <strong>{info.familyNome}</strong> como{" "}
              <Chip
                size="small"
                label={info.papel ? rotuloPapel(info.papel) : ""}
                sx={{ ml: 0.5 }}
              />
            </Alert>

            {erro && <Alert severity="error">{erro}</Alert>}

            {logado ? (
              <>
                <Typography variant="body2" color="text.secondary">
                  Aceite para acessar os registros compartilhados desta família.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ minHeight: 52 }}
                  disabled={aceitando}
                  onClick={aceitar}
                >
                  Entrar nesta família
                </Button>
                <Button color="inherit" onClick={onFinish} disabled={aceitando}>
                  Agora não
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body2" color="text.secondary">
                  Entre ou crie sua conta para aceitar. O convite fica guardado —
                  você o confirma logo após acessar.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ minHeight: 52 }}
                  onClick={() => setMostrarAuth(true)}
                >
                  Entrar ou criar conta
                </Button>
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
}
