import Paper from "@mui/material/Paper";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

export type Aba = "home" | "analises";

/**
 * Navegação inferior MD3 (wireframe W1). Dev e Sons entram nos sprints S2+
 * (aparecem desativados para sinalizar o roteiro).
 */
export function BottomNav(props: {
  aba: Aba;
  onChange: (aba: Aba) => void;
}) {
  return (
    <Paper
      elevation={3}
      sx={{ position: "sticky", bottom: 0, left: 0, right: 0 }}
    >
      <BottomNavigation
        showLabels
        value={props.aba}
        onChange={(_, v: Aba) => props.onChange(v)}
      >
        <BottomNavigationAction value="home" label="Início" icon={<span>🏠</span>} />
        <BottomNavigationAction
          value="analises"
          label="Análises"
          icon={<span>📊</span>}
        />
        <BottomNavigationAction disabled label="Dev" icon={<span>🧩</span>} />
        <BottomNavigationAction disabled label="Sons" icon={<span>🎵</span>} />
      </BottomNavigation>
    </Paper>
  );
}
