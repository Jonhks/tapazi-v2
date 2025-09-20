import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreIcon from "@mui/icons-material/MoreVert";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Menu, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import { messagemodalInstallmobile } from "@/utils/app";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
const Icons = [
  <SportsSoccerIcon key="ball" />,
  <EmojiEventsOutlinedIcon key="champion" />,
  <DescriptionOutlinedIcon key="receipt" />,
  <QueryStatsOutlinedIcon key="stats" />,
  <LogoutIcon key="logout" />,
  <MoreIcon key="more" />,
];

function MenuMobileEpl() {
  const params = useParams();
  const userId = params.userId!;
  const navigate = useNavigate();
  const sportId = params.sportId || "1"; // Default to 1 if sportId is not provided

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const pages = [
    { text: "Home", id: `epl/home/${userId}/sportId=${sportId}` },
    {
      text: "My Portfolio",
      id: `epl/myPortfolio/${userId}/sportId=${sportId}`,
    },
    {
      text: "Instructions",
      id: `epl/instructions/${userId}/sportId=${sportId}`,
    },
    { text: "Stats", id: `epl/stats/${userId}/sportId=${sportId}` },
    { text: "LogOut", id: "logOut" },
    { text: "More", id: "epl/more" },
  ];

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const userName = JSON.parse(localStorage.getItem("userTapaszi") || "");

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

  const LogoutSwal = () => {
    handleMobileMenuClose();
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3ED076",
      cancelButtonColor: "#c7630b",
      color: "white",
      background: "#200930", // Cambia el color de fondo
      confirmButtonText: "Yes, I want to log out!!!",
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
    handleMobileMenuClose();
    Swal.fire({
      title: "How to Install The Portfolio Pool on Your Device?",
      html: messagemodalInstallmobile,
      icon: "question",
      heightAuto: false,
      scrollbarPadding: false,
      confirmButtonColor: "#238b94",
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
    >
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
        <p
          style={{
            color: "#4BF589",
          }}
        >
          {userName.name || "Invitado"}
        </p>
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
        position="sticky"
        sx={{ bottom: 0, backgroundColor: "#380f51" }}
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
                    color: "#4BF589",
                  },
                }}
              >
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={(e) => {
                    if (pages[index].id === "logOut") {
                      removeUser();
                    } else if (pages[index].id === "epl/more") {
                      openMenuMobile(e);
                    } else {
                      navigate(pages[index].id);
                    }
                  }}
                  color="inherit"
                >
                  {icon}
                </IconButton>
              </Box>
            ))}
          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu}
    </Box>
  );
}
export default MenuMobileEpl;
