import { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { fmtCrono } from "../lib/format";

export interface BreastResult {
  inicio: Date;
  fim: Date;
  duracaoE: number;
  duracaoD: number;
  ultimoLado: "E" | "D";
}

interface Props {
  open: boolean;
  ladoSugerido: "E" | "D";
  onClose: () => void;
  onSave: (r: BreastResult) => void;
}

/** Cronômetro de amamentação (RF-TRK-01, wireframe W2). */
export function BreastTimerDialog({ open, ladoSugerido, onClose, onSave }: Props) {
  const [lado, setLado] = useState<"E" | "D">(ladoSugerido);
  const [segE, setSegE] = useState(0);
  const [segD, setSegD] = useState(0);
  const inicioRef = useRef<Date>(new Date());

  useEffect(() => {
    if (!open) return;
    setLado(ladoSugerido);
    setSegE(0);
    setSegD(0);
    inicioRef.current = new Date();
    const t = setInterval(() => {
      setLado((l) => {
        if (l === "E") setSegE((s) => s + 1);
        else setSegD((s) => s + 1);
        return l;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [open, ladoSugerido]);

  const total = segE + segD;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Amamentação</DialogTitle>
      <DialogContent>
        <Stack spacing={3} alignItems="center" sx={{ py: 1 }}>
          <Typography variant="h2" component="p" aria-live="polite">
            {fmtCrono(total)}
          </Typography>
          <ToggleButtonGroup
            value={lado}
            exclusive
            fullWidth
            onChange={(_, v: "E" | "D" | null) => v && setLado(v)}
          >
            <ToggleButton value="E" sx={{ minHeight: 48 }}>
              Esquerdo {fmtCrono(segE)}
            </ToggleButton>
            <ToggleButton value="D" sx={{ minHeight: 48 }}>
              Direito {fmtCrono(segD)}
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ minHeight: 56 }}
            disabled={total === 0}
            onClick={() =>
              onSave({
                inicio: inicioRef.current,
                fim: new Date(),
                duracaoE: segE,
                duracaoD: segD,
                ultimoLado: lado,
              })
            }
          >
            ■ Parar e salvar
          </Button>
          <Button onClick={onClose}>Cancelar</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
