import { useParams } from "react-router-dom";
import SharedAppLayout from "@/shared/components/Layout/SharedAppLayout";
import SharedMenu from "@/shared/components/Menu/SharedMenu";
import SharedMenuMobile from "@/shared/components/Menu/SharedMenuMobile";
import { leagueThemes, getNavItems } from "@/theme/leagues";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { BasquetIcon } from "@/assets/icons/icons";

import BgHome from "@/assets/img/NCAA-FEMALE-HOME-BACK.png";

const theme = leagueThemes.female;

const desktopIcons = [
  <SportsBasketballOutlinedIcon key="ball" />,
  <BasquetIcon key="basquet" />,
  <ReceiptLongIcon key="receipt" />,
  <TextSnippetIcon key="stats" />,
  <HistoryIcon key="history" />,
  <LogoutIcon key="logout" />,
];

const mobileIcons = [
  <SportsBasketballOutlinedIcon key="ball" />,
  <BasquetIcon key="basquet" />,
  <ReceiptLongIcon key="receipt" />,
  <TextSnippetIcon key="stats" />,
  <HistoryIcon key="history" />,
];

const AppLayoutFemale = () => {
  const { userId, sportId } = useParams();
  const navItems = getNavItems("female", userId!, sportId);
  const mobileNavItems = navItems.filter((item) => item.id !== "logOut");

  return (
    <SharedAppLayout
      backgroundImage={BgHome}
      menu={
        <SharedMenu
          leagueTheme={theme}
          navItems={navItems}
          icons={desktopIcons}
        />
      }
      menuMobile={
        <SharedMenuMobile
          leagueTheme={theme}
          navItems={mobileNavItems}
          icons={mobileIcons}
        />
      }
    />
  );
};

export default AppLayoutFemale;
