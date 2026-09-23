import { Dialog, DialogContent, Box, Typography, Chip, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import { useEffect } from "react";
import { useDraggable } from "@/shared/hooks/useDraggable";
import { getEnvLabel } from "@/utils/envLabel";

type ReleaseGroup = {
  version: string;
  commits: { hash: string; subject: string }[];
};

// Inyectado en build time por vite.config.ts a partir de `git log` — ver el
// comentario ahí para cómo se arman los grupos por versión.
const releaseNotes: ReleaseGroup[] = import.meta.env.VITE_RELEASE_NOTES ?? [];

export interface ReleaseNotesModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ReleaseNotesModal({
  open,
  onClose,
}: ReleaseNotesModalProps) {
  const { position, reset, handleProps } = useDraggable();

  // Mismo criterio que WalletModal: resetea posición al ABRIR, no al cerrar,
  // para no verla "saltar" al centro mientras el Dialog todavía se desvanece.
  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#0a0a0a",
          border: "2px solid #000",
          borderRadius: "8px",
          color: "#fff",
          transform: `translate(${position.x}px, ${position.y}px)`,
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Box
          {...handleProps}
          sx={{ textAlign: "center", mb: 1, position: "relative" }}
        >
          <IconButton
            onClick={onClose}
            aria-label="Close"
            sx={{ position: "absolute", top: -8, right: -8, color: "#888" }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            <HistoryIcon sx={{ color: "#3ED076", fontSize: 28 }} />
            Release Notes
          </Typography>
          <Typography sx={{ color: "#888", fontSize: 12, mt: 0.5 }}>
            v{import.meta.env.VITE_APP_VERSION} (
            {import.meta.env.VITE_APP_COMMIT}) — versión actualmente instalada
          </Typography>
          <Typography sx={{ color: "#666", fontSize: 12 }}>
            Ambiente: {getEnvLabel()}
          </Typography>
        </Box>

        <Box
          sx={{
            maxHeight: "60vh",
            overflowY: "scroll",
            overflowX: "hidden",
            mt: 2,
            pr: 1,
          }}
        >
          {releaseNotes.length === 0 && (
            <Typography sx={{ color: "#888", textAlign: "center", mt: 4 }}>
              No hay historial disponible.
            </Typography>
          )}

          {releaseNotes.map((release, i) => (
            <Box
              key={`${release.version}-${i}`}
              sx={{ mb: 3 }}
            >
              <Chip
                label={`v${release.version}`}
                size="small"
                sx={{
                  bgcolor: "#141414",
                  color: "#3ED076",
                  fontWeight: 700,
                  border: "1px solid #3ED07655",
                  mb: 1,
                }}
              />
              <Box
                component="ul"
                sx={{ m: 0, pl: 0, listStyle: "none" }}
              >
                {release.commits.map((commit) => (
                  <Box
                    component="li"
                    key={commit.hash}
                    sx={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 1.5,
                      py: 0.5,
                      borderBottom: "1px solid #ffffff0f",
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: "#666",
                        flexShrink: 0,
                      }}
                    >
                      {commit.hash}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{ fontSize: 13 }}
                    >
                      {commit.subject}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
