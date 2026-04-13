/**
 * MenuMobile — barra inferior móvil compartida entre todos los deportes.
 *
 * El último NavItem con id que contiene "more" abre el popup de menú.
 * El NavItem con id === "logOut" llama removeUser() directamente.
 */
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import LogoutIcon from "@mui/icons-material/Logout";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import { Badge, Menu, MenuItem } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { messagemodalInstallmobile } from "@/utils/app";
import WalletModal from "@/shared/components/WalletModal/WalletModal";
import type { NavItem, SwalConfig } from "./MenuDrawer";

// ─── tipos ────────────────────────────────────────────────────────────────────

export interface MenuMobileProps {
  navItems: NavItem[];
  activeColor: string;
  appBarBgColor: string;
  /** Color de fondo del popup "More". */
  menuPaperBgColor: string;
  sportKey: "ncaaMale" | "ncaaFemale" | "epl" | "worldcup";
  sportFrom: string;
  /** Color del label de username en el popup. Default: "inherit". */
  usernameLabelColor?: string;
  swal: SwalConfig;
}

// ─── segmentos activos ─────────────────────────────────────────────────────────
const ACTIVE_SEGMENTS = ["home", "myPortfolio", "instructions", "stats", "history"];

const isMoreItem = (id: string) =>
  id === "more" || id.endsWith("/more");

// ─── componente ───────────────────────────────────────────────────────────────

export default function MenuMobile({
  navItems,
  activeColor,
  appBarBgColor,
  menuPaperBgColor,
  sportKey,
  sportFrom,
  usernameLabelColor = "inherit",
  swal,
}: MenuMobileProps) {
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.userId!;
  const location = useLocation();

  const DEFAULT_COLOR = "inherit";

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const [walletOpen, setWalletOpen] = useState(false);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
  const openMenuMobile = (e: React.MouseEvent<HTMLElement>) =>
    setMobileMoreAnchorEl(e.currentTarget);

  const userName = JSON.parse(localStorage.getItem("userTapaszi") || "{}");

  const isActive = (id: string) => {
    if (id === "logOut" || isMoreItem(id)) return false;
    const parts = id.split("/");
    const segment = parts.find((p) => ACTIVE_SEGMENTS.includes(p));
    return segment ? location.pathname.includes(segment) : false;
  };

  const LogoutSwal = () => {
    handleMobileMenuClose();
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: swal.confirmColor,
      cancelButtonColor: swal.cancelColor ?? "#e18331ff",
      background: swal.bgColor,
      color: swal.textColor ?? "#fff",
      confirmButtonText: "Yes, I want to log out!!!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("userTapaszi");
        navigate("/login");
        Swal.fire({
          title: "Logged out!",
          text: "You have logged out.",
          icon: "success",
          confirmButtonColor: swal.confirmColor,
          background: swal.bgColor,
          color: swal.textColor ?? "#fff",
        });
      }
    });
  };

  const showInstallModal = () => {
    handleMobileMenuClose();
    Swal.fire({
      title: "How to Install The Portfolio Pool on Your Device?",
      html: messagemodalInstallmobile,
      icon: "question",
      heightAuto: false,
      scrollbarPadding: false,
      confirmButtonColor: swal.confirmColor,
      background: swal.bgColor,
      color: swal.textColor ?? "#fff",
    });
  };

  // Popup "More"
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
          sx: { backgroundColor: menuPaperBgColor, color: "#fff" },
        },
      }}
    >
      {/* Ir al selector de deporte */}
      <MenuItem onClick={() => navigate(`/sports/${userId}?from=${sportFrom}`)}>
        <IconButton size="large" color="inherit">
          <AltRouteIcon />
        </IconButton>
        <p>Sports Selection</p>
      </MenuItem>

      {/* Instalar PWA */}
      <MenuItem onClick={showInstallModal}>
        <IconButton size="large" color="inherit">
          <InstallMobileIcon />
        </IconButton>
        <p>Install</p>
      </MenuItem>

      {/* Nombre de usuario */}
      <MenuItem>
        <IconButton size="large" color="inherit">
          <AccountCircle />
        </IconButton>
        <p style={{ color: usernameLabelColor }}>
          {userName?.name || "Invitado"}
        </p>
      </MenuItem>

      {/* Wallet */}
      <MenuItem
        onClick={() => {
          handleMobileMenuClose();
          setWalletOpen(true);
        }}
      >
        <IconButton size="large" color="inherit">
          <MonetizationOnIcon sx={{ color: "#dc903b" }} />
        </IconButton>
        <p style={{ color: "#dc903b" }}>My Wallet</p>
      </MenuItem>

      {/* Logout */}
      <MenuItem onClick={LogoutSwal}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={0} color="error">
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
          backgroundColor: appBarBgColor,
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {navItems.map((item, index) => (
              <Box
                key={item.icon ? (item.icon as React.ReactElement).key ?? index : index}
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", md: "none", justifyContent: "center" },
                }}
              >
                <IconButton
                  size="large"
                  onClick={(e) => {
                    if (item.id === "logOut") {
                      LogoutSwal();
                    } else if (isMoreItem(item.id)) {
                      openMenuMobile(e);
                    } else {
                      navigate(item.id);
                    }
                  }}
                  sx={{
                    color: isActive(item.id) ? activeColor : DEFAULT_COLOR,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      color: activeColor,
                    },
                  }}
                >
                  {item.icon}
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
        sportKey={sportKey}
      />
    </Box>
  );
}
