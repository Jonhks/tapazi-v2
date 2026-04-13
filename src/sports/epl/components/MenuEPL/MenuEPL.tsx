import { useParams } from "react-router-dom";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuDrawer from "@/shared/components/Menu/MenuDrawer";

export default function MenuEPL() {
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId || "1";

  return (
    <MenuDrawer
      activeColor="#4BF589"
      defaultColor="gray"
      sportKey="epl"
      sportFrom="epl"
      appBarBgColor="#380f51"
      appBarIconColor="#4BF589"
      drawerBgColor="#380f51"
      titleColor="#4BF589"
      showUsernameInBar={false}
      swal={{
        confirmColor: "#3ED076",
        cancelColor: "#c7630b",
        bgColor: "#200930",
        textColor: "white",
      }}
      navItems={[
        { text: "Home",         id: `epl/home/${userId}/${sportId}`,         icon: <SportsSoccerIcon /> },
        { text: "My Portfolio", id: `epl/myPortfolio/${userId}/${sportId}`,  icon: <EmojiEventsOutlinedIcon /> },
        { text: "Instructions", id: `epl/instructions/${userId}/${sportId}`, icon: <DescriptionOutlinedIcon /> },
        { text: "Stats",        id: `epl/stats/${userId}/${sportId}`,        icon: <QueryStatsOutlinedIcon /> },
        { text: "LogOut",       id: "logOut",                                icon: <LogoutIcon /> },
      ]}
    />
  );
}
