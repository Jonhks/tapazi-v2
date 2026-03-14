import { useParams } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import SharedMenu from "@/shared/components/Menu/SharedMenu";
import { leagueThemes, getNavItems } from "@/theme/leagues";

export default function MenuWorldCup() {
  const { userId, sportId } = useParams();
  const theme = leagueThemes.worldcup;
  const navItems = getNavItems("worldcup", userId!, sportId);

  const icons = [
    <PublicIcon key="home" />,
    <EmojiEventsOutlinedIcon key="portfolio" />,
    <DescriptionOutlinedIcon key="instructions" />,
    <QueryStatsOutlinedIcon key="stats" />,
    <HistoryIcon key="history" />,
    <LogoutIcon key="logout" />,
  ];

  return (
    <SharedMenu
      leagueTheme={theme}
      navItems={navItems}
      icons={icons}
    />
  );
}
