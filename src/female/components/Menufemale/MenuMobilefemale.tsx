import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { BasquetIcon, PodiumIcon } from "@/assets/icons/icons";
import MoreIcon from "@mui/icons-material/MoreVert";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Badge, Menu, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import { messagemodalInstallmobile } from "@/utils/app";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
// import Basket from "@/assets/icons/basket.png";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import WalletModal from "@/shared/components/WalletModal/WalletModal";

const Icons = [
  <SportsBasketballOutlinedIcon key="ball" />,
  // <img
  //   key="basquet"
  //   src={Basket}
  //   alt="Basketball Hoop"
  //   style={{ width: 24, height: 24 }}
  // />,
  <BasquetIcon key="basquet" />,
  <ReceiptLongIcon key="receipt" />,
  <PodiumIcon key="stats" />,
  <HistoryIcon key="history" />,
  <MoreIcon key="more" />,
];

// const Icons = [
//   <SportsBasketballOutlinedIcon key="ball" />,
//   <img
//   key="basquet"
//   src={Basket}
//   alt="Basketball Hoop"
//   style={{ width: 24, height: 24 }}
// />,
//   <ReceiptLongIcon key="receipt" />,
// <PodiumIcon key="stats" />,
//   <HistoryIcon key="history" />,
//   <LogoutIcon key="logout" />,
// ];

function ResponsiveAppBar() {
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId || "1";
  const navigate = useNavigate();
  const location = useLocation();

  const ACTIVE_COLOR = "#e040fb";
  const DEFAULT_COLOR = "inherit";

  const isActive = (id: string) => {
    if (id === "more") return false;
    const parts = id.split("/");
    const segment = parts.find((p) =>
      ["home", "myPortfolio", "instructions", "stats", "history"].includes(p),
    );
    return segment ? location.pathname.includes(segment) : false;
  };

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const [walletOpen, setWalletOpen] = useState(false);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const pages = [
    { text: "Home", id: `/ncaa-female/home/${userId}/${sportId}` },
    {
      text: "My Portfolios",
      id: `/ncaa-female/myPortfolio/${userId}/${sportId}`,
    },
    {
      text: "Instructions",
      id: `/ncaa-female/instructions/${userId}/${sportId}`,
    },
    { text: "Stats", id: `/ncaa-female/stats/${userId}/${sportId}` },
    { text: "History", id: `/ncaa-female/history/${userId}/${sportId}` },
    { text: "More", id: "more" },
  ];

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const userName = JSON.parse(localStorage.getItem("userTapaszi") || "");

  const LogoutSwal = () => {
    handleMobileMenuClose();
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgba(223, 42, 249, .8)",
      cancelButtonColor: "#e18331ff",
      background: "rgba(36, 37, 62, .8)",
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
          confirmButtonColor: "rgba(223, 42, 249, .8)",
          background: "rgba(36, 37, 62, .8)",
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
      confirmButtonColor: " rgba(223, 42, 249, .8)",
      background: "rgba(36, 37, 62, .8)",
      color: "#fff",
    });
  };

  const openMenuMobile = (e: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(e.currentTarget);
  };

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "rgba(36, 37, 62, 0.95)",
            color: "#fff",
          },
        },
      }}
    >
      <MenuItem onClick={() => navigate(`/sports/${userId}`)}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AltRouteIcon />
        </IconButton>
        <p>Sports Section</p>
      </MenuItem>
      <MenuItem onClick={showInstructions}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <InstallMobileIcon />
        </IconButton>
        <p>Install</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>{userName.name || "Invitado"}</p>
      </MenuItem>
      <MenuItem onClick={() => { handleMobileMenuClose(); setWalletOpen(true); }}>
        <IconButton size="large" color="inherit">
          <MonetizationOnIcon sx={{ color: "#dc903b" }} />
        </IconButton>
        <p style={{ color: "#dc903b" }}>My Wallet</p>
      </MenuItem>
      <MenuItem onClick={() => LogoutSwal()}>
        <IconButton
          size="large"
          aria-label="show 4 new mails"
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
          backgroundColor: "#24253e",
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
                  display: {
                    xs: "flex",
                    md: "none",
                    justifyContent: "center",
                    color: "#DC903B",
                  },
                }}
              >
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={(e) =>
                    pages[index].id !== "more"
                      ? navigate(pages[index].id)
                      : openMenuMobile(e)
                  }
                  color={isActive(pages[index].id) ? "secondary" : "inherit"}
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
        participantId={userName.id ?? ""}
        participantName={userName.name ?? ""}
        sportKey="ncaaFemale"
      />
    </Box>
  );
}
export default ResponsiveAppBar;
