import { useParams } from "react-router-dom";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import MoreIcon from "@mui/icons-material/MoreVert";
import { BasquetIcon, PodiumIcon } from "@/assets/icons/icons";
import HistoryIcon from "@mui/icons-material/History";
import MenuMobile from "@/shared/components/Menu/MenuMobile";

export default function ResponsiveAppBar() {
  const params = useParams();
  const userId = params.userId!;

  return (
    <MenuMobile
      activeColor="#05fa87"
      appBarBgColor="#000"
      menuPaperBgColor="rgba(0, 0, 0, 0.8)"
      sportKey="ncaaMale"
      sportFrom="ncaa-male"
      swal={{
        confirmColor: "rgba(5, 250, 5, .8)",
        cancelColor: "#e18331ff",
        bgColor: "rgba(0, 0, 0, 0.8)",
        textColor: "#fff",
      }}
      navItems={[
        { text: "Home",          id: `home/${userId}`,         icon: <SportsBasketballOutlinedIcon key="ball" /> },
        { text: "My Portfolios", id: `myPortfolio/${userId}`,  icon: <BasquetIcon key="basquet" /> },
        { text: "Instructions",  id: `instructions/${userId}`, icon: <ReceiptLongIcon key="receipt" /> },
        { text: "Stats",         id: `stats/${userId}`,        icon: <PodiumIcon key="stats" /> },
        { text: "History",       id: `history/${userId}`,      icon: <HistoryIcon key="history" /> },
        { text: "More",          id: "more",                   icon: <MoreIcon key="more" /> },
      ]}
    />
  );
}
