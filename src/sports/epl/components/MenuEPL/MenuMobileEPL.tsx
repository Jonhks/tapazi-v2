import { useParams } from "react-router-dom";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MoreIcon from "@mui/icons-material/MoreVert";
import MenuMobile from "@/shared/components/Menu/MenuMobile";

export default function MenuMobileEpl() {
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId || "1";

  return (
    <MenuMobile
      activeColor="#4BF589"
      appBarBgColor="#380f51"
      menuPaperBgColor="rgba(32, 9, 48, 0.95)"
      sportKey="epl"
      sportFrom="epl"
      usernameLabelColor="#4BF589"
      swal={{
        confirmColor: "#3ED076",
        cancelColor: "#c7630b",
        bgColor: "#200930",
        textColor: "white",
      }}
      navItems={[
        { text: "Home",         id: `epl/home/${userId}/${sportId}`,         icon: <SportsSoccerIcon key="ball" /> },
        { text: "My Portfolio", id: `epl/myPortfolio/${userId}/${sportId}`,  icon: <EmojiEventsOutlinedIcon key="champion" /> },
        { text: "Instructions", id: `epl/instructions/${userId}/${sportId}`, icon: <DescriptionOutlinedIcon key="receipt" /> },
        { text: "Stats",        id: `epl/stats/${userId}/${sportId}`,        icon: <QueryStatsOutlinedIcon key="stats" /> },
        { text: "LogOut",       id: "logOut",                                icon: <LogoutIcon key="logout" /> },
        { text: "More",         id: "epl/more",                              icon: <MoreIcon key="more" /> },
      ]}
    />
  );
}
