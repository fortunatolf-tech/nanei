import type { Event } from "@nanei/contracts";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { fmtHora, fmtDuracao } from "../lib/format";

const ICONES: Record<string, string> = {
  mamada: "🤱",
  mamadeira: "🍼",
  fralda: "🧷",
  sono: "💤",
};

function descricao(e: Event): string {
  const p = e.payload as Record<string, unknown>;
  switch (e.tipo) {
    case "mamada": {
      const total = Number(p.duracaoE ?? 0) + Number(p.duracaoD ?? 0);
      return `Mamada ${String(p.ultimoLado ?? "")} · ${fmtDuracao(total)}`;
    }
    case "mamadeira":
      return `Mamadeira · ${String(p.ml)} ml (${p.tipo === "formula" ? "fórmula" : "ordenhado"})`;
    case "fralda":
      return `Fralda · ${String(p.tipo)}`;
    case "sono":
      return `${p.tipo === "noturno" ? "Sono noturno" : "Soneca"} · ${fmtDuracao(Number(p.minutos) * 60)}`;
    default:
      return e.tipo;
  }
}

/** Linha do tempo diária (RF-TRK-15, wireframe W1). */
export function Timeline(props: { events: Event[]; onDelete: (id: string) => void }) {
  if (props.events.length === 0) {
    return (
      <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
        Nenhum registro hoje ainda. Toque em um card acima — leva 2 toques. 💙
      </Typography>
    );
  }
  return (
    <List dense>
      {props.events.map((e) => (
        <ListItem
          key={e.id}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="excluir registro"
              onClick={() => props.onDelete(e.id)}
            >
              ✕
            </IconButton>
          }
        >
          <ListItemText
            primary={`${fmtHora(e.inicio)}  ${ICONES[e.tipo] ?? "•"}  ${descricao(e)}`}
          />
        </ListItem>
      ))}
    </List>
  );
}
