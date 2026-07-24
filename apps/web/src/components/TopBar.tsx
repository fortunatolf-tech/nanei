import type { Baby } from "@nanei/contracts";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import { BabySwitcher } from "./BabySwitcher";

/** Barra superior compartilhada entre as abas (wireframe W1). */
export function TopBar(props: {
  babies: Baby[];
  activeId: string | null;
  online: boolean;
  pendentes: number;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onLogout: () => void;
}) {
  return (
    <AppBar position="sticky" color="transparent" elevation={0}>
      <Toolbar>
        {props.babies.length > 0 ? (
          <Box sx={{ flexGrow: 1 }}>
            <BabySwitcher
              babies={props.babies}
              activeId={props.activeId}
              onSelect={props.onSelect}
              onAdd={props.onAdd}
            />
          </Box>
        ) : (
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
            nanei!
          </Typography>
        )}
        {!props.online && (
          <Chip size="small" label="offline" color="warning" sx={{ mr: 1 }} />
        )}
        {props.online && props.pendentes > 0 && (
          <Chip
            size="small"
            label={`sincronizando ${props.pendentes}`}
            sx={{ mr: 1 }}
          />
        )}
        <Button size="small" color="inherit" onClick={props.onLogout}>
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
}
