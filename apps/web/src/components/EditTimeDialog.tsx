import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import type { LocalEvent } from "../lib/eventStore";
import { fromLocalInput, toLocalInput } from "../lib/format";

/**
 * Edição retroativa da data/hora de um registro (RF-TRK-14). Ao mover o
 * início, um evento com fim (sono/mamada) tem a duração preservada — o fim
 * desloca pelo mesmo intervalo.
 */
export function EditTimeDialog(props: {
  event: LocalEvent | null;
  onClose: () => void;
  onSave: (idempotencyKey: string, inicio: Date, fim?: Date) => void;
}) {
  const { event } = props;
  const [valor, setValor] = useState("");

  useEffect(() => {
    if (event) setValor(toLocalInput(new Date(event.inicio)));
  }, [event]);

  function salvar() {
    if (!event) return;
    const novoInicio = fromLocalInput(valor);
    let novoFim: Date | undefined;
    if (event.fim) {
      const dur = new Date(event.fim).getTime() - new Date(event.inicio).getTime();
      novoFim = new Date(novoInicio.getTime() + dur);
    }
    props.onSave(event.idempotencyKey, novoInicio, novoFim);
  }

  return (
    <Dialog open={event !== null} onClose={props.onClose} fullWidth maxWidth="xs">
      <DialogTitle>Editar horário</DialogTitle>
      <DialogContent>
        <TextField
          label="Início"
          type="datetime-local"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          slotProps={{
            inputLabel: { shrink: true },
            htmlInput: { max: toLocalInput(new Date()) },
          }}
          fullWidth
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancelar</Button>
        <Button variant="contained" disabled={!valor} onClick={salvar}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
