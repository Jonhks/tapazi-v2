import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import MoreIcon from "@mui/icons-material/MoreVert";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Badge, Menu, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import { messagemodalInstallmobile } from "@/utils/app";
import { sportThemes } from "@/shared/theme/colors";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import WalletModal from "@/shared/components/WalletModal/WalletModal";

const wc = sportThemes.worldcup;

const Icons = [
  <SportsSoccerIcon key="soccer" />,
  <EmojiEventsIcon key="trophy" />,
  <ReceiptLongIcon key="receipt" />,
  <TextSnippetIcon key="stats" />,
  // <HistoryIcon key="history" />,
  <MoreIcon key="more" />,
];

function MenuWorldCupMobile() {
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId!;
  const navigate = useNavigate();
  const location = useLocation();

  const ACTIVE_COLOR = wc.positive;
  const DEFAULT_COLOR = "inherit";

  const isActive = (id: string) => {
    if (id === "more") return false;
    const segment = id.split("/")[1]; // "home" | "myPortfolio" | "stats" | etc.
    return location.pathname.includes(segment);
  };

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const [walletOpen, setWalletOpen] = useState(false);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const pages = [
    { text: "Home", id: `worldcup/home/${userId}/${sportId}` },
    { text: "My Portfolios", id: `worldcup/myPortfolio/${userId}/${sportId}` },
    { text: "Instructions", id: `worldcup/instructions/${userId}/${sportId}` },
    { text: "Stats", id: `worldcup/stats/${userId}/${sportId}` },
    // { text: "History", id: `worldcup/history/${userId}/${sportId}` },
    { text: "More", id: "more" },
  ];

  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const userName = JSON.parse(localStorage.getItem("userTapaszi") || "{}");

  const LogoutSwal = () => {
    handleMobileMenuClose();
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: wc.accent,
      cancelButtonColor: "#e18331ff",
      background: "rgba(0, 41, 44, 0.95)",
      color: "#fff",
      confirmButtonText: "Yes, I want to log out!!!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("userTapaszi");
        navigate("/login");
        Swal.fire({
          title: "Logged out!",
          text: "You have logged out.",
          icon: "success",
          confirmButtonColor: wc.accent,
          background: "rgba(0, 41, 44, 0.95)",
          color: "#fff",
        });
      }
    });
  };

  const showInstructions = () => {
    handleMobileMenuClose();
    Swal.fire({
      title: "How to Install The Portfolio Pool on Your Device?",
      html: messagemodalInstallmobile,
      icon: "question",
      heightAuto: false,
      scrollbarPadding: false,
      confirmButtonColor: wc.accent,
      background: "rgba(0, 41, 44, 0.95)",
      color: "#fff",
    });
  };

  const openMenuMobile = (e: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(e.currentTarget);
  };

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      slotProps={{
        paper: {
          sx: { backgroundColor: "rgba(0, 41, 44, 0.95)", color: "#fff" },
        },
      }}
    >
      <MenuItem onClick={() => navigate(`/sports/${userId}`)}>
        <IconButton
          size="large"
          color="inherit"
        >
          <AltRouteIcon />
        </IconButton>
        <p>Sports Selection</p>
      </MenuItem>
      <MenuItem onClick={showInstructions}>
        <IconButton
          size="large"
          color="inherit"
        >
          <InstallMobileIcon />
        </IconButton>
        <p>Install</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>{userName?.name || "Invitado"}</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMobileMenuClose();
          setWalletOpen(true);
        }}
      >
        <IconButton
          size="large"
          color="inherit"
        >
          <MonetizationOnIcon sx={{ color: "#dc903b" }} />
        </IconButton>
        <p style={{ color: "#dc903b" }}>My Wallet</p>
      </MenuItem>
      <MenuItem onClick={() => LogoutSwal()}>
        <IconButton
          size="large"
          color="inherit"
        >
          <Badge
            badgeContent={0}
            color="error"
          >
            <LogoutIcon />
          </Badge>
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{
          top: "auto",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: wc.appBar,
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {Icons.map((icon, index) => (
              <Box
                key={icon.key}
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", md: "none", justifyContent: "center" },
                }}
              >
                <IconButton
                  size="large"
                  onClick={(e) =>
                    pages[index].id !== "more"
                      ? navigate(`/${pages[index].id}`)
                      : openMenuMobile(e)
                  }
                  sx={{
                    color: isActive(pages[index].id)
                      ? ACTIVE_COLOR
                      : DEFAULT_COLOR,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      color: ACTIVE_COLOR,
                    },
                  }}
                >
                  {icon}
                </IconButton>
              </Box>
            ))}
          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu}
      <WalletModal
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        participantId={userName?.id ?? ""}
        participantName={userName?.name ?? ""}
        sportKey="worldcup"
      />
    </Box>
  );
}

export default MenuWorldCupMobile;
