import { useState } from "react";
import type { Baby } from "@nanei/contracts";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { BabySwitcher } from "./BabySwitcher";

/** Barra superior compartilhada entre as abas (wireframe W1). */
export function TopBar(props: {
  babies: Baby[];
  activeId: string | null;
  online: boolean;
  pendentes: number;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onFamily: () => void;
  onLogout: () => void;
}) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const fechar = () => setAnchor(null);

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
        <IconButton
          edge="end"
          color="inherit"
          aria-label="mais opções"
          sx={{ fontSize: 22, fontWeight: 700 }}
          onClick={(e) => setAnchor(e.currentTarget)}
        >
          ⋮
        </IconButton>
        <Menu anchorEl={anchor} open={anchor !== null} onClose={fechar}>
          <MenuItem
            disabled={props.babies.length === 0}
            onClick={() => {
              fechar();
              props.onFamily();
            }}
          >
            Família e cuidadores
          </MenuItem>
          <MenuItem
            onClick={() => {
              fechar();
              props.onLogout();
            }}
          >
            Sair
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
