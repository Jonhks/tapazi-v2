import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
// import { BasquetIcon, BallIcon, PodiumIcon } from "@/assets/icons/icons";
import MoreIcon from "@mui/icons-material/MoreVert";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Menu, MenuItem } from "@mui/material";
import Swal from "sweetalert2";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import { messagemodalInstallmobile } from "@/utils/app";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import Basket from "@/assets/icons/basket.png";

const Icons = [
  <SportsBasketballOutlinedIcon key="ball" />,
      <img 
    key="basquet" 
    src={Basket} 
    alt="Basketball Hoop" 
    style={{ width: 24, height: 24 }}
  />,
  <ReceiptLongIcon key="receipt" />,
  // <PodiumIcon key="stats" />,
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
  //   // <PodiumIcon key="stats" />,
  //   <HistoryIcon key="history" />,
  //   <LogoutIcon key="logout" />,
  // ];

function ResponsiveAppBar() {
  const params = useParams();
  const userId = params.userId!;
  const navigate = useNavigate();

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const pages = [
    { text: "Home", id: `home/${userId}` },
    { text: "My Portfolios", id: `myPortfolio/${userId}` },
    { text: "Instructions", id: `instructions/${userId}` },
    // { text: "Stats", id: `stats/${userId}` },
    { text: "History", id: `history/${userId}` },
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
      confirmButtonColor: "#238b94",
      cancelButtonColor: "#c7630b",
      confirmButtonText: "Yes, I want to log out!!!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("userTapaszi");
        navigate("/login");
        Swal.fire({
          title: "Logged out!",
          text: "You have logged out.",
          icon: "success",
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
        <p>{userName.name || "Invitado"}</p>
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
        sx={{ bottom: 0, backgroundColor: "#000" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {Icons.map((icon, index) => (
              <Box
                key={icon.key}
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", md: "none", justifyContent: "center", color: "#DC903B" },
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
export default ResponsiveAppBar;
