import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import type { TermsEntry } from "@/api/AuthAPI";

interface TermsOfUseModalProps {
  open: boolean;
  terms: TermsEntry[];
  onAccept: () => Promise<void>;
  onCancel: () => void;
}

const TermsOfUseModal = ({
  open,
  terms,
  onAccept,
  onCancel,
}: TermsOfUseModalProps) => {
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await onAccept();
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="md"
      fullWidth
      disableEscapeKeyDown
      slotProps={{
        paper: {
          style: {
            background: "rgba(0, 0, 0, 0.97)",
            border: "2px solid #00e2f6",
            borderRadius: 20,
            color: "white",
          },
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Typography
          variant="h5"
          sx={{ color: "#00e2f6", textAlign: "center", mb: 2, fontWeight: "bold" }}
        >
          Terms &amp; Conditions
        </Typography>
        <Box
          sx={{
            border: "2px solid #00e2f6",
            borderRadius: 3,
            p: 2,
            maxHeight: "55vh",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          {(Array.isArray(terms) ? terms : []).map((entry, i) => (
            <div
              key={i}
              style={{
                color: entry.highlighted ? "#00e2f6" : "white",
                backgroundColor: entry.highlighted ? "#003b40" : "transparent",
                borderRadius: entry.highlighted ? 8 : 0,
                padding: "8px 16px",
                fontFamily: "Arial, Helvetica, sans-serif",
              }}
            >
              {entry.description?.split("\n").map((line, j) => (
                <p key={j} style={{ margin: "4px 0" }}>
                  {line}
                </p>
              ))}
            </div>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={isAccepting}
          sx={{ color: "#aaa", borderColor: "#aaa", minWidth: 120, fontSize: 16 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAccept}
          disabled={isAccepting}
          sx={{ background: "#00929e", minWidth: 120, fontSize: 16, "&:hover": { background: "#007a85" } }}
        >
          {isAccepting ? (
            <CircularProgress size={22} sx={{ color: "white" }} />
          ) : (
            "Accept"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsOfUseModal;
