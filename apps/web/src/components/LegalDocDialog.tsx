import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { DOCUMENTOS_LEGAIS, type DocumentoLegalId } from "@nanei/legal";

/**
 * Leitor dos documentos legais versionados (RF-ACC-08/09). O texto vem de
 * @nanei/legal — a mesma fonte que a API usa para detectar re-consentimento.
 */
export function LegalDocDialog({
  doc,
  onClose,
}: {
  doc: DocumentoLegalId | null;
  onClose: () => void;
}) {
  const documento = doc ? DOCUMENTOS_LEGAIS[doc] : null;

  return (
    <Dialog open={documento !== null} onClose={onClose} scroll="paper" fullWidth>
      {documento && (
        <>
          <DialogTitle>
            {documento.titulo}
            <Typography variant="caption" color="text.secondary" display="block">
              Versão {documento.versao}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              {documento.secoes.map((secao) => (
                <div key={secao.titulo}>
                  <Typography variant="subtitle2" gutterBottom>
                    {secao.titulo}
                  </Typography>
                  {secao.paragrafos.map((p, i) => (
                    <Typography
                      key={i}
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {p}
                    </Typography>
                  ))}
                </div>
              ))}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Fechar</Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
