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
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import Swal from "sweetalert2";
import classes from "./Menu.module.css";
import { messagemodalInstall } from "@/utils/app";
import { sportThemes } from "@/shared/theme/colors";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import WalletModal from "@/shared/components/WalletModal/WalletModal";

const wc = sportThemes.worldcup;
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

interface AppBarProps {
  open?: boolean;
}

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

interface DrawerProps {
  open?: boolean;
}

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

export default function MenuWorldCup() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId!;
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("userTapaszi") || "{}");

  const ACTIVE_COLOR = wc.positive;
  const DEFAULT_COLOR = wc.defaultIcon;

  const isActive = (id: string) => {
    if (id === "logOut") return false;
    const segment = id.split("/")[1]; // "home" | "myPortfolio" | "stats" | etc.
    return location.pathname.includes(segment);
  };

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const removeUser = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: wc.accent,
      cancelButtonColor: "#e18331ff",
      background: "rgba(0, 41, 44, 0.95)",
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
          confirmButtonColor: wc.accent,
          background: "rgba(0, 41, 44, 0.95)",
          color: "#fff",
        });
      }
    });
  };

  const showInstructions = () => {
    Swal.fire({
      title: "How to Install The Portfolio Pool on Your Device?",
      html: messagemodalInstall,
      icon: "question",
      heightAuto: false,
      scrollbarPadding: true,
      confirmButtonColor: wc.accent,
      background: "rgba(0, 41, 44, 0.95)",
      color: "#fff",
    });
  };

  const Icons = [
    <SportsSoccerIcon key="soccer" />,
    <EmojiEventsIcon key="trophy" />,
    <ReceiptLongIcon key="receipt" />,
    <TextSnippetIcon key="stats" />,
    // <HistoryIcon key="history" />,
    <LogoutIcon key="logout" />,
  ];

  const navItems = [
    { text: "Home", id: `worldcup/home/${userId}/${sportId}` },
    { text: "My Portfolios", id: `worldcup/myPortfolio/${userId}/${sportId}` },
    { text: "Instructions", id: `worldcup/instructions/${userId}/${sportId}` },
    { text: "Stats", id: `worldcup/stats/${userId}/${sportId}` },
    // { text: "History", id: `worldcup/history/${userId}/${sportId}` },
    { text: "LogOut", id: "logOut" },
  ];

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          open={open}
          className={classes.appbar}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ marginRight: 5, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
              <div>
                <Typography className={classes.titleDrawerFuera}>
                  {JSON.parse(localStorage.getItem("userTapaszi") || "{}")
                    ?.name || "Username"}
                </Typography>
              </div>
            </IconButton>
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
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
                <MonetizationOnIcon sx={{ color: "#dc903b", mr: 0.5 }} />$ 1,023
              </Typography>
              <Tooltip
                title="Go to sports selection"
                placement="bottom"
              >
                <IconButton
                  color="inherit"
                  onClick={() => navigate(`/sports/${userId}`)}
                  edge="end"
                  sx={{ marginRight: 5 }}
                >
                  <AltRouteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title="¿How to Install The Portfolio Pool?"
                placement="bottom"
              >
                <IconButton
                  color="inherit"
                  onClick={showInstructions}
                  edge="end"
                  sx={{ marginRight: 5 }}
                >
                  <InstallDesktopIcon />
                </IconButton>
              </Tooltip>
            </div>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="permanent"
          open={open}
          className={classes.Mydrawer}
        >
          <DrawerHeader className={classes.appbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          {open && (
            <Typography className={classes.titleDrawer}>
              {JSON.parse(localStorage.getItem("userTapaszi") || "{}")?.name ||
                "Username"}
            </Typography>
          )}
          <List>
            {navItems.map((el, index) => (
              <Grid key={index}>
                <Tooltip
                  title={el.text}
                  placement="right"
                >
                  <ListItem
                    disablePadding
                    sx={{ display: "block" }}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                        transition: "all 0.2s ease-in-out",
                        "&:hover": {
                          backgroundColor: "rgba(5, 250, 135, 0.08)",
                          transform: "translateX(4px)",
                        },
                        ...(isActive(el.id) && {
                          backgroundColor: "rgba(5, 250, 135, 0.05)",
                          borderRight: `4px solid ${ACTIVE_COLOR}`,
                        }),
                      }}
                      onClick={() =>
                        el.id !== "logOut"
                          ? navigate(`/${el.id}`)
                          : removeUser()
                      }
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          color: isActive(el.id) ? ACTIVE_COLOR : DEFAULT_COLOR,
                        }}
                      >
                        {Icons[index]}
                      </ListItemIcon>
                      <ListItemText
                        primary={el.text}
                        sx={{
                          opacity: open ? 1 : 0,
                          "& .MuiTypography-root": {
                            color: isActive(el.id) ? ACTIVE_COLOR : "inherit",
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

        <Box
          component="main"
          sx={{ flexGrow: 1 }}
        >
          <DrawerHeader />
        </Box>
      </Box>

      <WalletModal
        open={walletOpen}
        onClose={() => setWalletOpen(false)}
        participantId={user.id ?? ""}
        participantName={user.name ?? ""}
        sportKey="worldcup"
      />
    </>
  );
}
