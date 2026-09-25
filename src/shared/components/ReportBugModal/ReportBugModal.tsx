import { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import { toast } from "react-toastify";
import { Sentry } from "@/lib/sentry";

export interface ReportBugModalProps {
  open: boolean;
  onClose: () => void;
  /** Se llama solo cuando el reporte SÍ se mandó (no al cancelar/cerrar). */
  onSubmitted?: () => void;
  /** Tag libre para saber desde dónde se mandó (ej. "login"). */
  source: string;
}

export default function ReportBugModal({
  open,
  onClose,
  onSubmitted,
  source,
}: ReportBugModalProps) {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    if (submitting) return;
    setMessage("");
    setEmail("");
    onClose();
  };

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error("Please describe the problem before sending.");
      return;
    }
    setSubmitting(true);
    Sentry.captureFeedback({
      message: message.trim(),
      email: email.trim() || undefined,
      tags: { source },
    });
    setSubmitting(false);
    toast.success("Thanks — your report was sent.");
    onSubmitted?.();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: "#0a0a0a",
          border: "2px solid #000",
          borderRadius: "8px",
          color: "#fff",
        },
      }}
    >
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            <BugReportIcon sx={{ color: "#D4AF37" }} />
            Report a Problem
          </Typography>
          <Typography sx={{ color: "#888", fontSize: 13, mt: 1 }}>
            Tell us what went wrong — what you were trying to do, and what
            happened instead.
          </Typography>
        </Box>

        <TextField
          multiline
          minRows={4}
          fullWidth
          placeholder="Describe the problem..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={submitting}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": { borderColor: "#333" },
              "&:hover fieldset": { borderColor: "#555" },
            },
          }}
        />

        <TextField
          fullWidth
          placeholder="Email/User (optional, if you want a reply)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              color: "#fff",
              "& fieldset": { borderColor: "#333" },
              "&:hover fieldset": { borderColor: "#555" },
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            sx={{
              backgroundColor: "#D4AF37",
              color: "#000",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#c7a12e" },
            }}
          >
            Send
          </Button>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={submitting}
            sx={{ color: "#ccc", borderColor: "#444" }}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
