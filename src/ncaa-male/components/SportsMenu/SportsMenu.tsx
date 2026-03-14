import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SportsMenu() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userTapaszi") || "{}");

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
    <AppBar position="fixed" sx={{ backgroundColor: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(5px)" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#05fa87" }}>
          {user.name || "Username"}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Typography variant="body1" sx={{ color: "#fff", fontWeight: 600 }}>
            Balance: <span style={{ color: "#dc903b" }}>$45Dlls</span>
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon sx={{ color: "#dc903b" }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
