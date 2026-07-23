import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

/** Registro de mamadeira (RF-TRK-02). */
export function BottleDialog(props: {
  open: boolean;
  onClose: () => void;
  onSave: (ml: number, tipo: "formula" | "ordenhado") => void;
}) {
  const [ml, setMl] = useState("120");
  const [tipo, setTipo] = useState<"formula" | "ordenhado">("formula");
  const qtd = Number(ml);
  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="xs">
      <DialogTitle>Mamadeira</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Quantidade (ml)"
            type="number"
            value={ml}
            onChange={(e) => setMl(e.target.value)}
            fullWidth
            slotProps={{ htmlInput: { min: 1, max: 500, inputMode: "numeric" } }}
          />
          <ToggleButtonGroup
            value={tipo}
            exclusive
            fullWidth
            onChange={(_, v: "formula" | "ordenhado" | null) => v && setTipo(v)}
          >
            <ToggleButton value="formula" sx={{ minHeight: 48 }}>Fórmula</ToggleButton>
            <ToggleButton value="ordenhado" sx={{ minHeight: 48 }}>Leite ordenhado</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={!Number.isFinite(qtd) || qtd <= 0}
          onClick={() => props.onSave(qtd, tipo)}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** Registro de fralda (RF-TRK-05). */
export function DiaperDialog(props: {
  open: boolean;
  onClose: () => void;
  onSave: (tipo: "xixi" | "coco" | "ambos") => void;
}) {
  const [tipo, setTipo] = useState<"xixi" | "coco" | "ambos">("xixi");
  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="xs">
      <DialogTitle>Fralda</DialogTitle>
      <DialogContent>
        <ToggleButtonGroup
          value={tipo}
          exclusive
          fullWidth
          sx={{ pt: 1 }}
          onChange={(_, v: "xixi" | "coco" | "ambos" | null) => v && setTipo(v)}
        >
          <ToggleButton value="xixi" sx={{ minHeight: 48 }}>Xixi</ToggleButton>
          <ToggleButton value="coco" sx={{ minHeight: 48 }}>Cocô</ToggleButton>
          <ToggleButton value="ambos" sx={{ minHeight: 48 }}>Ambos</ToggleButton>
        </ToggleButtonGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => props.onSave(tipo)}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** Registro de sono manual (RF-TRK-06). */
export function SleepDialog(props: {
  open: boolean;
  onClose: () => void;
  onSave: (minutos: number, tipo: "soneca" | "noturno") => void;
}) {
  const [minutos, setMinutos] = useState("45");
  const [tipo, setTipo] = useState<"soneca" | "noturno">("soneca");
  const min = Number(minutos);
  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="xs">
      <DialogTitle>Sono</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Duração (minutos) — terminou agora"
            type="number"
            value={minutos}
            onChange={(e) => setMinutos(e.target.value)}
            fullWidth
            slotProps={{ htmlInput: { min: 1, max: 960, inputMode: "numeric" } }}
          />
          <ToggleButtonGroup
            value={tipo}
            exclusive
            fullWidth
            onChange={(_, v: "soneca" | "noturno" | null) => v && setTipo(v)}
          >
            <ToggleButton value="soneca" sx={{ minHeight: 48 }}>Soneca</ToggleButton>
            <ToggleButton value="noturno" sx={{ minHeight: 48 }}>Noturno</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancelar</Button>
        <Button
          variant="contained"
          disabled={!Number.isFinite(min) || min <= 0}
          onClick={() => props.onSave(min, tipo)}
        >
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
