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
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { BasquetIcon, BallIcon } from "@/assets/icons/icons";
import classes from "./Menu.module.css";
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

export default function MiniDrawer() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // const removeUser = () => {
  //   localStorage.removeItem("userTapaszi");
  //   setIsAuthenticated(false);
  //   navigate("/login");
  // };

  const Icons = [
    <BallIcon key="ball" />,
    <BasquetIcon key="basquet" />,
    <ReceiptLongIcon key="receipt" />,
    <HistoryIcon key="history" />,
    <LogoutIcon key="logout" />,
  ];

  return (
    <>
      {/* {!hideMenu ? ( */}
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
              sx={{ marginRight: 5, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
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
              { text: "Home", id: "home" },
              { text: "My Portfolios", id: "myPorfolio" },
              { text: "Instructions", id: "instructions" },
              { text: "Stats & History", id: "history" },
              { text: "LogOut", id: "logOut" },
            ].map((el, index) => (
              <Grid
                item
                key={index}
              >
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
                      onClick={() => {
                        // el?.id !== "logOut" ? navigate(el?.id) : removeUser();
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                          color: "white",
                        }}
                      >
                        {Icons[index]}
                      </ListItemIcon>
                      <ListItemText
                        primary={el?.text}
                        onClick={() => navigate(el?.id)}
                        sx={{ opacity: open ? 1 : 0 }}
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
          sx={{ flexGrow: 1, p: 3 }}
          className={classes.fondo}
        >
          <DrawerHeader />
        </Box>
      </Box>
    </>
  );
}
