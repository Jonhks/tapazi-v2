import { useParams } from "react-router-dom";
import SharedAppLayout from "@/shared/components/Layout/SharedAppLayout";
import SharedMenu from "@/shared/components/Menu/SharedMenu";
import SharedMenuMobile from "@/shared/components/Menu/SharedMenuMobile";
import { leagueThemes, getNavItems } from "@/theme/leagues";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import QueryStatsOutlinedIcon from "@mui/icons-material/QueryStatsOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

const BG_HOME =
  "https://s3.mx-central-1.amazonaws.com/portfolio.pool/sports/epl/home/back_home_epl.png";

const theme = leagueThemes.epl;

const desktopIcons = [
  <SportsSoccerIcon key="ball" />,
  <EmojiEventsOutlinedIcon key="champion" />,
  <DescriptionOutlinedIcon key="instructions" />,
  <QueryStatsOutlinedIcon key="stats" />,
  <LogoutIcon key="logout" />,
];

// EPL mobile: logout va como ícono directo (como en el original), sin History
const mobileIcons = [
  <SportsSoccerIcon key="ball" />,
  <EmojiEventsOutlinedIcon key="champion" />,
  <DescriptionOutlinedIcon key="instructions" />,
  <QueryStatsOutlinedIcon key="stats" />,
  <LogoutIcon key="logout" />,
];

const AppLayoutEPL = () => {
  const { userId, sportId } = useParams();
  const navItems = getNavItems("epl", userId!, sportId);
  // EPL incluye logOut como ícono directo en mobile (comportamiento original)
  const mobileNavItems = navItems;

  return (
    <SharedAppLayout
      backgroundImage={BG_HOME}
      menu={
        <SharedMenu
          leagueTheme={theme}
          navItems={navItems}
          icons={desktopIcons}
          showUsernameInToolbar={false}
        />
      }
      menuMobile={
        <SharedMenuMobile
          leagueTheme={theme}
          navItems={mobileNavItems}
          icons={mobileIcons}
          position="sticky"
        />
      }
    />
  );
};

export default AppLayoutEPL;
