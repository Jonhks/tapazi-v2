import { useParams } from "react-router-dom";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryIcon from "@mui/icons-material/History";
import MoreIcon from "@mui/icons-material/MoreVert";
import { BasquetIcon, PodiumIcon } from "@/assets/icons/icons";
import MenuMobile from "@/shared/components/Menu/MenuMobile";

export default function ResponsiveAppBar() {
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId || "1";

  return (
    <MenuMobile
      activeColor="#e040fb"
      appBarBgColor="#24253e"
      menuPaperBgColor="rgba(36, 37, 62, 0.95)"
      sportKey="ncaaFemale"
      sportFrom="female"
      swal={{
        confirmColor: "rgba(223, 42, 249, .8)",
        cancelColor: "#e18331ff",
        bgColor: "rgba(36, 37, 62, .8)",
        textColor: "#fff",
      }}
      navItems={[
        { text: "Home",          id: `/ncaa-female/home/${userId}/${sportId}`,         icon: <SportsBasketballOutlinedIcon key="ball" /> },
        { text: "My Portfolios", id: `/ncaa-female/myPortfolio/${userId}/${sportId}`,  icon: <BasquetIcon key="basquet" /> },
        { text: "Instructions",  id: `/ncaa-female/instructions/${userId}/${sportId}`, icon: <ReceiptLongIcon key="receipt" /> },
        { text: "Stats",         id: `/ncaa-female/stats/${userId}/${sportId}`,        icon: <PodiumIcon key="stats" /> },
        { text: "History",       id: `/ncaa-female/history/${userId}/${sportId}`,      icon: <HistoryIcon key="history" /> },
        { text: "More",          id: "more",                                           icon: <MoreIcon key="more" /> },
      ]}
    />
  );
}
