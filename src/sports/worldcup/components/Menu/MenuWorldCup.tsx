import { useParams } from "react-router-dom";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import LogoutIcon from "@mui/icons-material/Logout";
import { sportThemes } from "@/shared/theme/colors";
import MenuDrawer from "@/shared/components/Menu/MenuDrawer";

const wc = sportThemes.worldcup;

export default function MenuWorldCup() {
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId!;

  return (
    <MenuDrawer
      activeColor={wc.positive}
      defaultColor={wc.defaultIcon}
      sportKey="worldcup"
      sportFrom="worldcup"
      appBarBgColor={wc.appBar}
      appBarIconColor={wc.accent}
      drawerBgColor={wc.appBar}
      titleColor={wc.positive}
      showUsernameInBar
      swal={{
        confirmColor: wc.accent,
        cancelColor: "#e18331ff",
        bgColor: "rgba(0, 41, 44, 0.95)",
        textColor: "#fff",
      }}
      navItems={[
        { text: "Home",          id: `/worldcup/home/${userId}/${sportId}`,         icon: <SportsSoccerIcon /> },
        { text: "My Portfolios", id: `/worldcup/myPortfolio/${userId}/${sportId}`,  icon: <EmojiEventsIcon /> },
        { text: "Instructions",  id: `/worldcup/instructions/${userId}/${sportId}`, icon: <ReceiptLongIcon /> },
        { text: "Stats",         id: `/worldcup/stats/${userId}/${sportId}`,        icon: <TextSnippetIcon /> },
        { text: "LogOut",        id: "logOut",                                      icon: <LogoutIcon /> },
      ]}
    />
  );
}
