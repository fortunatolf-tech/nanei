import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import { login, register } from "../api/auth";
import { ApiError } from "../api/client";

type Modo = "login" | "cadastro";

/**
 * Onboarding e consentimento (fluxo F1 — RF-ACC-01/04/08).
 * O consentimento "dados do bebê" é obrigatório; sem ele o cadastro não
 * prossegue (LGPD art. 14 §1º). Os demais são opcionais e granulares.
 */
export function AuthScreen({ onDone }: { onDone: () => void }) {
  const [modo, setModo] = useState<Modo>("cadastro");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeBebe, setNomeBebe] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [consentBebe, setConsentBebe] = useState(false);
  const [consentNotif, setConsentNotif] = useState(false);
  const [consentFotos, setConsentFotos] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const cadastro = modo === "cadastro";
  const podeCadastrar = email && senha.length >= 8 && consentBebe;

  async function submeter() {
    setErro(null);
    setCarregando(true);
    try {
      if (cadastro) {
        const consentimentos = ["dados_bebe"];
        if (consentNotif) consentimentos.push("notificacoes");
        if (consentFotos) consentimentos.push("fotos");
        await register({
          email,
          senha,
          consentimentos,
          nomeBebe: nomeBebe || undefined,
          nascimentoBebe: nascimento
            ? new Date(nascimento).toISOString()
            : undefined,
        });
      } else {
        await login(email, senha);
      }
      onDone();
    } catch (e) {
      setErro(
        e instanceof ApiError
          ? e.message
          : "Não foi possível conectar. Tente novamente.",
      );
    } finally {
      setCarregando(false);
    }
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
          <Typography variant="h3" component="h1">
            nanei!
          </Typography>
          <Typography color="text.secondary">
            {cadastro ? "Criar sua conta" : "Entrar"}
          </Typography>
        </Box>

        {erro && <Alert severity="error">{erro}</Alert>}

        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Senha"
          type="password"
          autoComplete={cadastro ? "new-password" : "current-password"}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          helperText={cadastro ? "Mínimo de 8 caracteres" : undefined}
          fullWidth
        />

        {cadastro && (
          <>
            <Divider>
              <Typography variant="overline" color="text.secondary">
                Bebê (opcional)
              </Typography>
            </Divider>
            <TextField
              label="Nome do bebê"
              value={nomeBebe}
              onChange={(e) => setNomeBebe(e.target.value)}
              fullWidth
            />
            <TextField
              label="Data de nascimento"
              type="date"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />

            <Divider>
              <Typography variant="overline" color="text.secondary">
                Consentimentos
              </Typography>
            </Divider>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={consentBebe}
                    onChange={(e) => setConsentBebe(e.target.checked)}
                  />
                }
                label="Autorizo o tratamento dos dados do bebê (obrigatório)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={consentNotif}
                    onChange={(e) => setConsentNotif(e.target.checked)}
                  />
                }
                label="Quero receber notificações e lembretes"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={consentFotos}
                    onChange={(e) => setConsentFotos(e.target.checked)}
                  />
                }
                label="Autorizo anexar fotos aos registros"
              />
            </FormGroup>
            <Typography variant="caption" color="text.secondary">
              Serviço de caráter informativo — não substitui orientação médica.
              Você pode revogar cada consentimento a qualquer momento.
            </Typography>
          </>
        )}

        <Button
          variant="contained"
          size="large"
          sx={{ minHeight: 52 }}
          disabled={carregando || (cadastro ? !podeCadastrar : !email || !senha)}
          onClick={submeter}
        >
          {cadastro ? "Criar conta" : "Entrar"}
        </Button>

        <Typography variant="body2" align="center" color="text.secondary">
          {cadastro ? "Já tem conta? " : "Novo por aqui? "}
          <Link
            component="button"
            type="button"
            onClick={() => {
              setModo(cadastro ? "login" : "cadastro");
              setErro(null);
            }}
          >
            {cadastro ? "Entrar" : "Criar conta"}
          </Link>
        </Typography>
      </Stack>
    </Box>
  );
}
