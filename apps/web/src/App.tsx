import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";

/**
 * Tema base MD3: modo escuro por padrão (princípio de uso noturno — §1.3),
 * breakpoint base 360px, alvos de toque ≥ 48dp.
 */
const theme = createTheme({
  palette: {
    mode: "dark",
  },
  shape: {
    borderRadius: 16,
  },
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          px: 2,
        }}
      >
        <Typography variant="h3" component="h1">
          nanei!
        </Typography>
        <Typography variant="body1" color="text.secondary" align="center">
          Sprint S0 — fundação. Home com linha do tempo chega no S1.
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
