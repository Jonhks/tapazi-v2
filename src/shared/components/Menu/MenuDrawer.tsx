/**
 * MenuDrawer — sidebar de escritorio compartido entre todos los deportes.
 *
 * Cada módulo de deporte tiene su propio wrapper que pre-configura:
 *   - navItems (rutas + iconos)
 *   - colores (activeColor, defaultColor, appBar, drawer)
 *   - sportKey para WalletModal
 *   - config de Swal (logout / install)
 */
import { useState } from "react";
import { styled, Theme, useTheme } from "@mui/material/styles";
import { MUIStyledCommonProps } from "@mui/system";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid2";
import Tooltip from "@mui/material/Tooltip";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { messagemodalInstall } from "@/utils/app";
import WalletModal from "@/shared/components/WalletModal/WalletModal";

// ─── tipos exportados para que los wrappers los usen ──────────────────────────

export interface NavItem {
  text: string;
  /** Ruta completa o parcial. "logOut" es especial → llama removeUser(). */
  id: string;
  icon: React.ReactNode;
}

export interface SwalConfig {
  confirmColor: string;
  cancelColor?: string;
  bgColor: string;
  textColor?: string;
}

export interface MenuDrawerProps {
  navItems: NavItem[];
  activeColor: string;
  defaultColor: string;
  sportKey: "ncaaMale" | "ncaaFemale" | "epl" | "worldcup";
  /** Valor del parámetro ?from= al redirigir al selector de deportes. */
  sportFrom: string;
  appBarBgColor: string;
  /** Color de iconos en AppBar (chevron, AltRoute, Install). */
  appBarIconColor?: string;
  drawerBgColor: string;
  titleColor: string;
  /** Si false, oculta el nombre de usuario junto al ícono de menú en la AppBar. Default true. */
  showUsernameInBar?: boolean;
  swal: SwalConfig;
}

// ─── MUI styled components (idénticos en todos los menús originales) ──────────

const drawerWidth = 240;

const openedMixin = (theme: Theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps { open?: boolean; }

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface DrawerProps { open?: boolean; }

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<DrawerProps & MUIStyledCommonProps<Theme>>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [],
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

// ─── segmentos de URL reconocidos como activos ─────────────────────────────────
const ACTIVE_SEGMENTS = ["home", "myPortfolio", "instructions", "stats", "history"];

// ─── componente ───────────────────────────────────────────────────────────────

export default function MenuDrawer({
  navItems,
  activeColor,
  defaultColor,
  sportKey,
  sportFrom,
  appBarBgColor,
  appBarIconColor,
  drawerBgColor,
  titleColor,
  showUsernameInBar = true,
  swal,
}: MenuDrawerProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const params = useParams();
  const userId = params.userId!;
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("userTapaszi") || "{}");

  // Funciona para todas las variantes de ruta: con prefijo de deporte, con slash, sin slash.
  const isActive = (id: string) => {
    if (id === "logOut") return false;
    const parts = id.split("/");
    const segment = parts.find((p) => ACTIVE_SEGMENTS.includes(p));
    return segment ? location.pathname.includes(segment) : false;
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const removeUser = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: swal.confirmColor,
      cancelButtonColor: swal.cancelColor ?? "#e18331ff",
      background: swal.bgColor,
      color: swal.textColor ?? "#fff",
      confirmButtonText: "Yes, I want to log out!!",
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
    Swal.fire({
      title: "How to Install The Portfolio Pool on Your Device?",
      html: messagemodalInstall,
      icon: "question",
      heightAuto: false,
      scrollbarPadding: true,
      confirmButtonColor: swal.confirmColor,
      background: swal.bgColor,
      color: swal.textColor ?? "#fff",
    });
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* ── AppBar superior ── */}
        <AppBar
          position="fixed"
          open={open}
          sx={{ backgroundColor: appBarBgColor, opacity: 0.9 }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                color: appBarIconColor ?? "inherit",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
              {showUsernameInBar && (
                <Typography
                  sx={{
                    fontSize: 20,
                    textAlign: "center",
                    paddingLeft: "16px",
                    color: titleColor,
                  }}
                >
                  {user?.name || "Username"}
                </Typography>
              )}
            </IconButton>

            {/* Acciones de la derecha */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {/* Wallet */}
              <Typography
                variant="body1"
                onClick={() => setWalletOpen(true)}
                sx={{
                  color: "#dc903b",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  mr: 2,
                  "&:hover": { opacity: 0.8 },
                }}
              >
                <MonetizationOnIcon sx={{ color: "#dc903b", mr: 0.5 }} />
                <span style={{ color: "#dc903b" }}>$ 1,023</span>
              </Typography>

              {/* Selector de deporte */}
              <Tooltip title="Go to sports selection" placement="bottom">
                <IconButton
                  color="inherit"
                  onClick={() => navigate(`/sports/${userId}?from=${sportFrom}`)}
                  edge="end"
                  sx={{ marginRight: 5, color: appBarIconColor ?? "inherit" }}
                >
                  <AltRouteIcon />
                </IconButton>
              </Tooltip>

              {/* Instalar PWA */}
              <Tooltip title="¿How to Install The Portfolio Pool?" placement="bottom">
                <IconButton
                  color="inherit"
                  onClick={showInstallModal}
                  edge="end"
                  sx={{ marginRight: 5, color: appBarIconColor ?? "inherit" }}
                >
                  <InstallDesktopIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>

        {/* ── Drawer lateral ── */}
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            "& .MuiDrawer-paper": {
              backgroundColor: drawerBgColor,
              color: "white",
            },
          }}
        >
          <DrawerHeader sx={{ backgroundColor: appBarBgColor, opacity: 0.9 }}>
            <IconButton
              onClick={handleDrawerClose}
              sx={{ color: appBarIconColor ?? "inherit" }}
            >
              {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />

          {open && (
            <Typography
              sx={{
                fontSize: 20,
                textAlign: "center",
                padding: "16px 0 0 0",
                fontWeight: "bold",
                color: titleColor,
              }}
            >
              {user?.name || "Username"}
            </Typography>
          )}

          <List>
            {navItems.map((el, index) => (
              <Grid key={index}>
                <Tooltip title={el.text} placement="right">
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          transform: "translateX(4px)",
                        },
                        ...(isActive(el.id) && {
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderRight: `4px solid ${activeColor}`,
                        }),
                      }}
                      onClick={() =>
                        el.id !== "logOut" ? navigate(el.id) : removeUser()
                      }
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          color: isActive(el.id) ? activeColor : defaultColor,
                        }}
                      >
                        {el.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={el.text}
                        sx={{
                          opacity: open ? 1 : 0,
                          "& .MuiTypography-root": {
                            color: isActive(el.id) ? activeColor : "inherit",
                            fontWeight: isActive(el.id) ? 700 : 400,
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              </Grid>
            ))}
          </List>
          <Divider />
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1 }}>
          <DrawerHeader />
        </Box>
      </Box>

      <WalletModal
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        participantId={user.id ?? ""}
        participantName={user.name ?? ""}
        sportKey={sportKey}
      />
    </>
  );
}
