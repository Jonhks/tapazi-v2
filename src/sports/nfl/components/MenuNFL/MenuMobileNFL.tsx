import { useParams } from "react-router-dom";
import SportsFootballIcon from "@mui/icons-material/SportsFootball";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreIcon from "@mui/icons-material/MoreVert";
import MenuMobile from "@/shared/components/Menu/MenuMobile";

export default function MenuMobileNfl() {
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId || "1";

  return (
    <MenuMobile
      activeColor="#D4AF37"
      appBarBgColor="#0a0a0a"
      menuPaperBgColor="rgba(10, 10, 10, 0.95)"
      sportKey="nfl"
      sportFrom="nfl"
      usernameLabelColor="#D4AF37"
      swal={{
        confirmColor: "#D4AF37",
        cancelColor: "#c7630b",
        bgColor: "#0a0a0a",
        textColor: "white",
      }}
      navItems={[
        { text: "Home",         id: `nfl/home/${userId}/${sportId}`,         icon: <SportsFootballIcon key="ball" /> },
        { text: "My Portfolio", id: `nfl/myPortfolio/${userId}/${sportId}`,  icon: <EmojiEventsOutlinedIcon key="champion" /> },
        { text: "Instructions", id: `nfl/instructions/${userId}/${sportId}`, icon: <DescriptionOutlinedIcon key="receipt" /> },
        { text: "Stats",        id: `nfl/stats/${userId}/${sportId}`,        icon: <QueryStatsOutlinedIcon key="stats" /> },
        { text: "LogOut",       id: "logOut",                                icon: <LogoutIcon key="logout" /> },
        { text: "More",         id: "nfl/more",                              icon: <MoreIcon key="more" /> },
      ]}
    />
  );
}
