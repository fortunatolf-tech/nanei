import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { addBaby } from "../lib/babyStore";
import { ApiError } from "../api/client";

/** Cadastro de um novo bebê (RF-FAM-01). */
export function AddBabyDialog(props: {
  open: boolean;
  obrigatorio?: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const [nome, setNome] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  async function salvar() {
    setErro(null);
    setSalvando(true);
    try {
      await addBaby({
        nome,
        nascimento: new Date(nascimento).toISOString(),
      });
      setNome("");
      setNascimento("");
      props.onDone();
    } catch (e) {
      setErro(
        e instanceof ApiError ? e.message : "Não foi possível salvar. Tente de novo.",
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.obrigatorio ? undefined : props.onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>Adicionar bebê</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {props.obrigatorio && (
            <Alert severity="info">
              Cadastre um bebê para começar a registrar.
            </Alert>
          )}
          {erro && <Alert severity="error">{erro}</Alert>}
          <TextField
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
            autoFocus
          />
          <TextField
            label="Data de nascimento"
            type="date"
            value={nascimento}
            onChange={(e) => setNascimento(e.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        {!props.obrigatorio && <Button onClick={props.onClose}>Cancelar</Button>}
        <Button
          variant="contained"
          disabled={salvando || !nome.trim() || !nascimento}
          onClick={salvar}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
