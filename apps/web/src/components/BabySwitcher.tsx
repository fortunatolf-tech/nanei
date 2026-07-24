import { useState } from "react";
import type { Baby } from "@nanei/contracts";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";

/**
 * Troca de bebê em 1 toque (RF-FAM-01, wireframe W1). Abre um menu com os
 * bebês da conta e a opção de adicionar outro.
 */
export function BabySwitcher(props: {
  babies: Baby[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
}) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const ativo = props.babies.find((b) => b.id === props.activeId);

  return (
    <>
      <Button
        color="inherit"
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ textTransform: "none", fontWeight: 600 }}
        aria-label="trocar de bebê"
      >
        {ativo?.nome ?? "Bebê"} ▾
      </Button>
      <Menu
        anchorEl={anchor}
        open={anchor !== null}
        onClose={() => setAnchor(null)}
      >
        {props.babies.map((b) => (
          <MenuItem
            key={b.id}
            selected={b.id === props.activeId}
            onClick={() => {
              props.onSelect(b.id);
              setAnchor(null);
            }}
          >
            <ListItemIcon>{b.id === props.activeId ? "✓" : ""}</ListItemIcon>
            {b.nome}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={() => {
            props.onAdd();
            setAnchor(null);
          }}
        >
          <ListItemIcon>＋</ListItemIcon>
          Adicionar bebê
        </MenuItem>
      </Menu>
    </>
  );
}
