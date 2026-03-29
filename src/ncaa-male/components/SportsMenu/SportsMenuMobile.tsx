import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import WalletModal from "@/shared/components/WalletModal/WalletModal";

export default function SportsMenuMobile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userTapaszi") || "{}");
  const [walletOpen, setWalletOpen] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgba(5, 250, 5, .8)",
      cancelButtonColor: "#e18331ff",
      background: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      confirmButtonText: "Yes, I want to log out!!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("userTapaszi");
        navigate("/login");
        Swal.fire({
          title: "Logged out!",
          text: "You have logged out.",
          icon: "success",
          confirmButtonColor: "rgba(5, 250, 5, .8)",
          background: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
        });
      }
    });
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          top: "auto",
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-around" }}>
            {/* Izquierda: nombre */}
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{ display: "block", color: "#05fa87", fontWeight: "bold" }}
              >
                {user.name || "User"}
              </Typography>
            </Box>

            {/* Centro: wallet */}
            <IconButton
              onClick={() => setWalletOpen(true)}
              sx={{ flexDirection: "column" }}
            >
              <MonetizationOnIcon sx={{ color: "#dc903b" }} />
              <Typography variant="caption" sx={{ color: "#dc903b" }}>
                Wallet
              </Typography>
            </IconButton>

            {/* Derecha: logout */}
            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{ flexDirection: "column" }}
            >
              <LogoutIcon sx={{ color: "#dc903b" }} />
              <Typography variant="caption" sx={{ color: "#fff" }}>
                Logout
              </Typography>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <WalletModal
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        participantId={user.id ?? ""}
        participantName={user.name ?? ""}
        sportKey="ncaaMale"
      />
    </>
  );
}
