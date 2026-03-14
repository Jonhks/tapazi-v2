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
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import type { ReactNode } from "react";
import { messagemodalInstall } from "@/utils/app";
import type { LeagueTheme, NavItem } from "@/theme/leagues";
import classes from "./SharedMenu.module.css";

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

type SharedMenuProps = {
  leagueTheme: LeagueTheme;
  navItems: NavItem[];
  icons: ReactNode[];
  /** Si se muestra el nombre del usuario en la barra superior (default: true) */
  showUsernameInToolbar?: boolean;
};

export default function SharedMenu({
  leagueTheme,
  navItems,
  icons,
  showUsernameInToolbar = true,
}: SharedMenuProps) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const userId = params.userId!;
  const location = useLocation();

  const isActive = (id: string) => {
    if (id === "logOut") return false;
    const parts = id.split("/");
    const segment = parts.find((p) =>
      ["home", "myPortfolio", "instructions", "stats", "history"].includes(p),
    );
    return segment ? location.pathname.includes(segment) : false;
  };

  const removeUser = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: leagueTheme.swalConfirm,
      cancelButtonColor: "#e18331ff",
      background: leagueTheme.swalBg,
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
          confirmButtonColor: leagueTheme.swalConfirm,
          background: leagueTheme.swalBg,
          color: "#fff",
        });
      }
    });
  };

  const showInstallInstructions = () => {
    Swal.fire({
      title: "How to Install The Portfolio Pool on Your Device?",
      html: messagemodalInstall,
      icon: "question",
      heightAuto: false,
      scrollbarPadding: true,
      confirmButtonColor: leagueTheme.swalConfirm,
      background: leagueTheme.swalBg,
      color: "#fff",
    });
  };

  const cssVars = {
    "--league-bg": leagueTheme.appbarBg,
    "--league-appbar-text": leagueTheme.appbarTextColor,
    "--league-accent": leagueTheme.accentColor,
    "--league-title-weight": leagueTheme.titleBold ? "700" : "400",
  } as React.CSSProperties;

  const username =
    JSON.parse(localStorage.getItem("userTapaszi") || "{}")?.name || "Username";

  return (
    <Box
      sx={{ display: "flex" }}
      style={cssVars}
    >
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
            onClick={() => setOpen(true)}
            edge="start"
            sx={{ marginRight: 5, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
            {showUsernameInToolbar && (
              <div>
                <Typography className={classes.titleDrawerFuera}>
                  {username}
                </Typography>
              </div>
            )}
          </IconButton>
          <div style={{ width: "100%", textAlign: "right" }}>
            <Tooltip
              title="Go to sports selection"
              placement="bottom"
            >
              <IconButton
                color="inherit"
                aria-label="sports selection"
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
                aria-label="install"
                onClick={showInstallInstructions}
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
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {open && (
          <Typography className={classes.titleDrawer}>{username}</Typography>
        )}
        <List>
          {navItems.map((item, index) => (
            <Grid key={index}>
              <Tooltip
                title={item.text}
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
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        transform: "translateX(4px)",
                      },
                      ...(isActive(item.id) && {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRight: `4px solid ${leagueTheme.accentColor}`,
                      }),
                    }}
                    onClick={() =>
                      item.id === "logOut" ? removeUser() : navigate(item.id)
                    }
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color: isActive(item.id)
                          ? leagueTheme.accentColor
                          : leagueTheme.defaultIconColor,
                      }}
                    >
                      {icons[index]}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      sx={{
                        opacity: open ? 1 : 0,
                        "& .MuiTypography-root": {
                          color: isActive(item.id)
                            ? leagueTheme.accentColor
                            : "inherit",
                          fontWeight: isActive(item.id) ? 700 : 400,
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
  );
}
