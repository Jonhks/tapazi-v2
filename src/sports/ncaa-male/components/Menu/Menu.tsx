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

  return (
    <MenuDrawer
      activeColor="#05fa87"
      defaultColor="#DC903B"
      sportKey="ncaaMale"
      sportFrom="ncaa-male"
      appBarBgColor="#000"
      appBarIconColor="#05fa05"
      drawerBgColor="#000"
      titleColor="#05fa05"
      showUsernameInBar
      swal={{
        confirmColor: "rgba(5, 250, 5, .8)",
        cancelColor: "#e18331ff",
        bgColor: "rgba(0, 0, 0, 0.8)",
        textColor: "#fff",
      }}
      navItems={[
        { text: "Home",          id: `home/${userId}`,         icon: <SportsBasketballOutlinedIcon /> },
        { text: "My Portfolios", id: `myPortfolio/${userId}`,  icon: <BasquetIcon /> },
        { text: "Instructions",  id: `instructions/${userId}`, icon: <ReceiptLongIcon /> },
        { text: "Stats",         id: `stats/${userId}`,        icon: <TextSnippetIcon /> },
        { text: "History",       id: `history/${userId}`,      icon: <HistoryIcon /> },
        { text: "LogOut",        id: "logOut",                 icon: <LogoutIcon /> },
      ]}
    />
  );
}
