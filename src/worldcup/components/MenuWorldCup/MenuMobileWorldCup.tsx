import { useParams } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import HistoryIcon from "@mui/icons-material/History";
import SharedMenuMobile from "@/shared/components/Menu/SharedMenuMobile";
import { leagueThemes, getNavItems } from "@/theme/leagues";

export default function MenuMobileWorldCup() {
  const { userId, sportId } = useParams();
  const theme = leagueThemes.worldcup;
  const navItems = getNavItems("worldcup", userId!, sportId);

  // El último ítem (logOut) se elimina porque SharedMenuMobile lo agrega en el dropdown "More"
  const mobileNavItems = navItems.filter((item) => item.id !== "logOut");

  const icons = [
    <PublicIcon key="home" />,
    <EmojiEventsOutlinedIcon key="portfolio" />,
    <DescriptionOutlinedIcon key="instructions" />,
    <QueryStatsOutlinedIcon key="stats" />,
    <HistoryIcon key="history" />,
  ];

  return (
    <SharedMenuMobile
      leagueTheme={theme}
      navItems={mobileNavItems}
      icons={icons}
    />
  );
}
