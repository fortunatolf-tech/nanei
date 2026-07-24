import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import type { Papel } from "@nanei/contracts";
import { ApiError } from "../api/client";
import {
  criarConvite,
  getResumoFamilia,
  linkDoConvite,
  revogarConvite,
  rotuloPapel,
  type ConvitePendente,
  type ResumoFamilia,
} from "../api/families";

const PAPEIS: Papel[] = ["editor", "registrador", "visualizador", "admin"];

/** Gestão de cuidadores da família do bebê ativo (RF-FAM-02/03, fluxo F4). */
export function FamilyDialog({
  familyId,
  open,
  onClose,
}: {
  familyId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [resumo, setResumo] = useState<ResumoFamilia | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [papel, setPapel] = useState<Papel>("registrador");
  const [enviando, setEnviando] = useState(false);
  const [linkNovo, setLinkNovo] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (!open || !familyId) return;
    setResumo(null);
    setErro(null);
    setLinkNovo(null);
    getResumoFamilia(familyId)
      .then(setResumo)
      .catch((e) =>
        setErro(e instanceof ApiError ? e.message : "Não foi possível carregar."),
      );
  }, [open, familyId]);

  const admin = resumo?.meuPapel === "admin";

  async function convidar() {
    if (!familyId) return;
    setEnviando(true);
    setErro(null);
    setCopiado(false);
    try {
      const inv = await criarConvite(familyId, email.trim(), papel);
      const link = linkDoConvite(inv.token);
      setLinkNovo(link);
      setEmail("");
      const pendente: ConvitePendente = {
        id: inv.id,
        email: inv.email,
        papel: inv.papel,
        expiraEm: inv.expiraEm,
        criadoEm: new Date().toISOString(),
      };
      setResumo((r) =>
        r ? { ...r, convites: [pendente, ...(r.convites ?? [])] } : r,
      );
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível convidar.");
    } finally {
      setEnviando(false);
    }
  }

  async function copiar(link: string) {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
    } catch {
      setCopiado(false);
    }
  }

  async function revogar(id: string) {
    if (!familyId) return;
    try {
      await revogarConvite(familyId, id);
      setResumo((r) =>
        r ? { ...r, convites: (r.convites ?? []).filter((c) => c.id !== id) } : r,
      );
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível revogar.");
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth scroll="paper">
      <DialogTitle>Família</DialogTitle>
      <DialogContent dividers>
        {erro && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {erro}
          </Alert>
        )}

        {!familyId && (
          <Typography variant="body2" color="text.secondary">
            Cadastre um bebê para gerenciar os cuidadores da família.
          </Typography>
        )}

        {familyId && !resumo && !erro && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress size={26} />
          </Box>
        )}

        {resumo && (
          <Stack spacing={2}>
            <div>
              <Typography variant="overline" color="text.secondary">
                Cuidadores
              </Typography>
              <Stack spacing={1} sx={{ mt: 0.5 }}>
                {resumo.membros.map((m) => (
                  <Box
                    key={m.email}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                      {m.email}
                    </Typography>
                    <Chip size="small" label={rotuloPapel(m.papel)} />
                  </Box>
                ))}
              </Stack>
            </div>

            {admin ? (
              <>
                <Divider />
                <div>
                  <Typography variant="overline" color="text.secondary">
                    Convidar cuidador
                  </Typography>
                  <Stack spacing={1.5} sx={{ mt: 0.5 }}>
                    <TextField
                      label="E-mail do convidado"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      select
                      label="Papel"
                      value={papel}
                      onChange={(e) => setPapel(e.target.value as Papel)}
                      fullWidth
                      size="small"
                    >
                      {PAPEIS.map((p) => (
                        <MenuItem key={p} value={p}>
                          {rotuloPapel(p)}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Button
                      variant="contained"
                      onClick={convidar}
                      disabled={enviando || !email.trim()}
                    >
                      Gerar link de convite
                    </Button>
                  </Stack>

                  {linkNovo && (
                    <Alert severity="success" sx={{ mt: 1.5 }}>
                      Link criado (válido por 48h). Envie ao cuidador:
                      <Box
                        sx={{
                          mt: 1,
                          p: 1,
                          bgcolor: "action.hover",
                          borderRadius: 1,
                          fontSize: 12,
                          wordBreak: "break-all",
                        }}
                      >
                        {linkNovo}
                      </Box>
                      <Button
                        size="small"
                        onClick={() => copiar(linkNovo)}
                        sx={{ mt: 0.5 }}
                      >
                        {copiado ? "Copiado!" : "Copiar link"}
                      </Button>
                    </Alert>
                  )}
                </div>

                {resumo.convites && resumo.convites.length > 0 && (
                  <>
                    <Divider />
                    <div>
                      <Typography variant="overline" color="text.secondary">
                        Convites pendentes
                      </Typography>
                      <Stack spacing={1} sx={{ mt: 0.5 }}>
                        {resumo.convites.map((c) => (
                          <Box
                            key={c.id}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 1,
                            }}
                          >
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                variant="body2"
                                sx={{ wordBreak: "break-all" }}
                              >
                                {c.email}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {rotuloPapel(c.papel)}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              aria-label="revogar convite"
                              onClick={() => revogar(c.id)}
                            >
                              ✕
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>
                    </div>
                  </>
                )}
              </>
            ) : (
              <Typography variant="caption" color="text.secondary">
                Apenas o administrador pode convidar ou remover cuidadores.
              </Typography>
            )}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}
