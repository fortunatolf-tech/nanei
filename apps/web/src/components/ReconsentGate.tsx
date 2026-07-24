import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import type { DocumentoLegalId } from "@nanei/legal";
import {
  aceitarLegal,
  getPendenciasLegais,
  type PendenciaLegal,
} from "../api/legal";
import { LegalDocDialog } from "./LegalDocDialog";

/**
 * Gate de re-consentimento (RF-ACC-08): ao logar, verifica se algum documento
 * legal foi atualizado desde o último aceite e bloqueia o app até o re-aceite.
 * Falhas de rede não bloqueiam — o gate volta a checar na próxima abertura.
 */
export function ReconsentGate({ children }: { children: React.ReactNode }) {
  const [pendencias, setPendencias] = useState<PendenciaLegal[]>([]);
  const [docAberto, setDocAberto] = useState<DocumentoLegalId | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    getPendenciasLegais()
      .then(setPendencias)
      .catch(() => {
        /* offline: não bloqueia o uso do app */
      });
  }, []);

  async function aceitar() {
    setEnviando(true);
    setErro(false);
    try {
      const restantes = await aceitarLegal(pendencias.map((p) => p.id));
      setPendencias(restantes);
    } catch {
      setErro(true);
    } finally {
      setEnviando(false);
    }
  }

  const bloqueado = pendencias.length > 0;

  return (
    <>
      {children}
      <Dialog open={bloqueado} disableEscapeKeyDown>
        <DialogTitle>Atualizamos nossos termos</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            Para continuar, revise e aceite as versões atualizadas:
            <Stack spacing={0.5} sx={{ mt: 1.5 }}>
              {pendencias.map((p) => (
                <Link
                  key={p.id}
                  component="button"
                  type="button"
                  textAlign="left"
                  onClick={() => setDocAberto(p.id)}
                >
                  {p.titulo} (versão {p.versaoVigente})
                </Link>
              ))}
            </Stack>
          </DialogContentText>
          {erro && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Não foi possível registrar o aceite. Tente novamente.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={aceitar} disabled={enviando}>
            Li e aceito
          </Button>
        </DialogActions>
      </Dialog>
      <LegalDocDialog doc={docAberto} onClose={() => setDocAberto(null)} />
    </>
  );
}
