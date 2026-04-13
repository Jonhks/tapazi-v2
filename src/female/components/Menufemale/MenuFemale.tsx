import { useParams } from "react-router-dom";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { BasquetIcon } from "@/assets/icons/icons";
import MenuDrawer from "@/shared/components/Menu/MenuDrawer";

export default function MiniDrawer() {
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId || "1";

  return (
    <MenuDrawer
      activeColor="#e040fb"
      defaultColor="#DC903B"
      sportKey="ncaaFemale"
      sportFrom="female"
      appBarBgColor="rgba(36, 37, 62, 0.95)"
      drawerBgColor="rgba(36, 37, 62, 0.95)"
      titleColor="#e040fb"
      showUsernameInBar
      swal={{
        confirmColor: "rgba(223, 42, 249, .8)",
        cancelColor: "#e18331ff",
        bgColor: "rgba(36, 37, 62, .8)",
        textColor: "#fff",
      }}
      navItems={[
        { text: "Home",          id: `/ncaa-female/home/${userId}/${sportId}`,         icon: <SportsBasketballOutlinedIcon /> },
        { text: "My Portfolios", id: `/ncaa-female/myPortfolio/${userId}/${sportId}`,  icon: <BasquetIcon /> },
        { text: "Instructions",  id: `/ncaa-female/instructions/${userId}/${sportId}`, icon: <ReceiptLongIcon /> },
        { text: "Stats",         id: `/ncaa-female/stats/${userId}/${sportId}`,        icon: <TextSnippetIcon /> },
        { text: "History",       id: `/ncaa-female/history/${userId}/${sportId}`,      icon: <HistoryIcon /> },
        { text: "LogOut",        id: "logOut",                                         icon: <LogoutIcon /> },
      ]}
    />
  );
}
