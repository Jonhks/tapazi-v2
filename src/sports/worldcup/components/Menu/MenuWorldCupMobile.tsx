import { useParams } from "react-router-dom";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import MoreIcon from "@mui/icons-material/MoreVert";
import { sportThemes } from "@/shared/theme/colors";
import MenuMobile from "@/shared/components/Menu/MenuMobile";

const wc = sportThemes.worldcup;

export default function MenuWorldCupMobile() {
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId!;

  return (
    <MenuMobile
      activeColor={wc.positive}
      appBarBgColor={wc.appBar}
      menuPaperBgColor="rgba(0, 41, 44, 0.95)"
      sportKey="worldcup"
      sportFrom="worldcup"
      swal={{
        confirmColor: wc.accent,
        cancelColor: "#e18331ff",
        bgColor: "rgba(0, 41, 44, 0.95)",
        textColor: "#fff",
      }}
      navItems={[
        { text: "Home",          id: `/worldcup/home/${userId}/${sportId}`,         icon: <SportsSoccerIcon key="soccer" /> },
        { text: "My Portfolios", id: `/worldcup/myPortfolio/${userId}/${sportId}`,  icon: <EmojiEventsIcon key="trophy" /> },
        { text: "Instructions",  id: `/worldcup/instructions/${userId}/${sportId}`, icon: <ReceiptLongIcon key="receipt" /> },
        { text: "Stats",         id: `/worldcup/stats/${userId}/${sportId}`,        icon: <TextSnippetIcon key="stats" /> },
        { text: "More",          id: "more",                                        icon: <MoreIcon key="more" /> },
      ]}
    />
  );
}
