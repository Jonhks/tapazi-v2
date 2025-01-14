import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { BasquetIcon, BallIcon } from "@/assets/icons/icons";
import { useNavigate, useParams } from "react-router-dom";

const Icons = [
  <BallIcon key="ball" />,
  <BasquetIcon key="basquet" />,
  <ReceiptLongIcon key="receipt" />,
  <HistoryIcon key="history" />,
  <LogoutIcon key="logout" />,
];

function ResponsiveAppBar() {
  const params = useParams();
  const userId = params.userId!;
  const navigate = useNavigate();

  const pages = [
    { text: "Home", id: `home/${userId}` },
    { text: "My Portfolios", id: `myPortfolio/${userId}` },
    { text: "Instructions", id: `instructions/${userId}` },
    { text: "Stats & History", id: `history/${userId}` },
    { text: "LogOut", id: "logOut" },
  ];

  const removeUser = () => {
    localStorage.removeItem("userTapaszi");
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      sx={{ bottom: 0, backgroundColor: "#238b94" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {Icons.map((icon, index) => (
            <Box
              key={icon.key}
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() =>
                  pages[index].id !== "logOut"
                    ? navigate(pages[index].id)
                    : removeUser()
                }
                color="inherit"
              >
                {icon}
              </IconButton>
            </Box>
          ))}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
