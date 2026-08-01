import { useParams } from "react-router-dom";
import SportsFootballIcon from "@mui/icons-material/SportsFootball";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuDrawer from "@/shared/components/Menu/MenuDrawer";

export default function MenuNFL() {
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId || "1";

  return (
    <MenuDrawer
      activeColor="#D4AF37"
      defaultColor="gray"
      sportKey="nfl"
      sportFrom="nfl"
      appBarBgColor="#0a0a0a"
      appBarIconColor="#D4AF37"
      drawerBgColor="#0a0a0a"
      titleColor="#D4AF37"
      showUsernameInBar={false}
      swal={{
        confirmColor: "#D4AF37",
        cancelColor: "#c7630b",
        bgColor: "#0a0a0a",
        textColor: "white",
      }}
      navItems={[
        { text: "Home",         id: `nfl/home/${userId}/${sportId}`,         icon: <SportsFootballIcon /> },
        { text: "My Portfolio", id: `nfl/myPortfolio/${userId}/${sportId}`,  icon: <EmojiEventsOutlinedIcon /> },
        { text: "Instructions", id: `nfl/instructions/${userId}/${sportId}`, icon: <DescriptionOutlinedIcon /> },
        { text: "Stats",        id: `nfl/stats/${userId}/${sportId}`,        icon: <QueryStatsOutlinedIcon /> },
        { text: "LogOut",       id: "logOut",                                icon: <LogoutIcon /> },
      ]}
    />
  );
}
