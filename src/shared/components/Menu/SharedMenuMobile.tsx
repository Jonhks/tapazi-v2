import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MoreIcon from "@mui/icons-material/MoreVert";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AltRouteIcon from "@mui/icons-material/AltRoute";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import LogoutIcon from "@mui/icons-material/Logout";
import { Badge, Menu, MenuItem } from "@mui/material";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import type { ReactNode } from "react";
import { messagemodalInstallmobile } from "@/utils/app";
import type { LeagueTheme, NavItem } from "@/theme/leagues";

type SharedMenuMobileProps = {
  leagueTheme: LeagueTheme;
  /** Items del menú principal. Usa "logOut" o "more" como ids especiales. */
  navItems: NavItem[];
  icons: ReactNode[];
  /** Posición del AppBar. EPL usa "sticky", el resto "fixed" */
  position?: "fixed" | "sticky";
};

export default function SharedMenuMobile({
  leagueTheme,
  navItems,
  icons,
  position = "fixed",
}: SharedMenuMobileProps) {
  const params = useParams();
  const userId = params.userId!;
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const isActive = (id: string) => {
    if (id === "more" || id === "logOut") return false;
    const parts = id.split("/");
    const segment = parts.find((p) =>
      ["home", "myPortfolio", "instructions", "stats", "history"].includes(p),
    );
    return segment ? location.pathname.includes(segment) : false;
  };

  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);

  const username =
    JSON.parse(localStorage.getItem("userTapaszi") || "{}")?.name || "Invitado";

  const removeUser = (afterClose = false) => {
    if (afterClose) handleMobileMenuClose();
    Swal.fire({
      title: "Are you sure?",
      text: "You want to log out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: leagueTheme.swalConfirm,
      cancelButtonColor: "#e18331ff",
      background: leagueTheme.swalBg,
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
          confirmButtonColor: leagueTheme.swalConfirm,
          background: leagueTheme.swalBg,
          color: "#fff",
        });
      }
    });
  };

  const showInstallInstructions = () => {
    handleMobileMenuClose();
    Swal.fire({
      title: "How to Install The Portfolio Pool on Your Device?",
      html: messagemodalInstallmobile,
      icon: "question",
      heightAuto: false,
      scrollbarPadding: false,
      confirmButtonColor: leagueTheme.swalConfirm,
      background: leagueTheme.swalBg,
      color: "#fff",
    });
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLElement>,
    item: NavItem,
  ) => {
    if (item.id === "logOut") {
      removeUser();
    } else if (item.id === "more") {
      setMobileMoreAnchorEl(e.currentTarget);
    } else {
      navigate(item.id);
    }
  };

  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMoreDropdown = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: leagueTheme.swalBg,
            color: "#fff",
          },
        },
      }}
    >
      <MenuItem onClick={() => navigate(`/sports/${userId}`)}>
        <IconButton size="large" color="inherit">
          <AltRouteIcon />
        </IconButton>
        <p>Sports Selection</p>
      </MenuItem>
      <MenuItem onClick={showInstallInstructions}>
        <IconButton size="large" color="inherit">
          <InstallMobileIcon />
        </IconButton>
        <p>Install</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <AccountCircle />
        </IconButton>
        <p style={{ color: leagueTheme.accentColor }}>{username}</p>
      </MenuItem>
      <MenuItem onClick={() => removeUser(true)}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={0} color="error">
            <LogoutIcon />
          </Badge>
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );

  const allIcons = [...icons, <MoreIcon key="more" />];
  const allItems = [...navItems, { text: "More", id: "more" }];

  return (
    <Box>
      <AppBar
        position={position}
        sx={{
          top: position === "fixed" ? "auto" : undefined,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: leagueTheme.mobileBg,
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {allIcons.map((icon, index) => (
              <Box
                key={allItems[index]?.id ?? index}
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", justifyContent: "center" },
                }}
              >
                <IconButton
                  size="large"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={(e) => handleNavClick(e, allItems[index])}
                  sx={{
                    color: isActive(allItems[index]?.id)
                      ? leagueTheme.accentColor
                      : "inherit",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      color: leagueTheme.accentColor,
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
      {renderMoreDropdown}
    </Box>
  );
}
