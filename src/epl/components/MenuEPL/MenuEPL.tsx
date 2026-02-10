import { useState } from "react";
import { styled, Theme, useTheme } from "@mui/material/styles";
import { MUIStyledCommonProps } from "@mui/system"; // Add this import statement
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
import { useNavigate, useParams } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import LogoutIcon from "@mui/icons-material/Logout";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import classes from "./MenuEPL.module.css";
import Swal from "sweetalert2";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import { messagemodalInstall } from "@/utils/app";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
const drawerWidth = 240;
import AltRouteIcon from "@mui/icons-material/AltRoute";

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
  variants: [], // Add an empty variants array to fix the error
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MenuEPL() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId || "1"; // Default to 1 if sportId is not provided

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const removeUser = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3ED076",
      cancelButtonColor: "#c7630b",
      color: "white",
      background: "#200930", // Cambia el color de fondo
      confirmButtonText: "Yes, I want to log out!!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("userTapaszi");
        navigate("/login");
        Swal.fire({
          title: "Logged out!",
          text: "You have logged out.",
          icon: "success",
          background: "#200930", // Cambia el color de fondo
          confirmButtonColor: "#3ED076",
          color: "white", // Cambia el color del texto
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
      confirmButtonColor: "#238b94",
    });
  };

  const Icons = [
    <SportsSoccerIcon key="ball" />,
    <EmojiEventsOutlinedIcon key="champion" />,
    <DescriptionOutlinedIcon key="receipt" />,
    <QueryStatsOutlinedIcon key="stats" />,
    <LogoutIcon key="logout" />,
  ];

  return (
    <>
      <Box
        sx={{ display: "flex" }}
        className={classes.containerHome}
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
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                color: "#4BF589",
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <div
              style={{
                width: "100%",
                textAlign: "right",
              }}
            >
              <Tooltip
                title="Go to sports selection"
                placement="bottom"
              >
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={() => navigate(`/sports/${userId}`)}
                  edge="end"
                  sx={{ marginRight: 5, color: "#4bf589" }}
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
                  aria-label="open drawer"
                  onClick={showInstructions}
                  edge="end"
                  sx={{ marginRight: 5, color: "#4bf589" }}
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
          <DrawerHeader className={`${classes.appbar}`}>
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
            {[
              { text: "Home", id: `epl/home/${userId}/${sportId}` },
              {
                text: "My Portfolio",
                id: `epl/myPortfolio/${userId}/${sportId}`,
              },
              {
                text: "Instructions",
                id: `epl/instructions/${userId}/${sportId}`,
              },
              { text: "Stats", id: `epl/stats/${userId}/${sportId}` },
              { text: "LogOut", id: "logOut" },
            ].map((el, index) => (
              <Grid key={index}>
                <Tooltip
                  title={el?.text}
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
                      }}
                      onClick={() =>
                        el?.id !== "logOut" ? navigate(el?.id) : removeUser()
                      }
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          color: "#4BF589",
                          fontSize: 24,
                          fontWeight: 300,
                        }}
                      >
                        {Icons[index]}
                      </ListItemIcon>
                      <ListItemText
                        primary={el?.text}
                        sx={{ opacity: open ? 1 : 0, fontWeight: 300 }}
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
          className={classes.fondo}
        >
          <DrawerHeader />
        </Box>
      </Box>
    </>
  );
}
