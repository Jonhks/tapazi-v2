// TODO: Adaptar de src/ncaa-male/views/HistoryPortfolios/HistoryPortfolios.tsx
// Cambiar imports de API a @/api/worldcup/HistoryAPIWorldCup
// Cambiar imports de Table a worldcup/components/Table/Table (TableBase)
import { useParams } from "react-router-dom";
import BallLoader from "../../components/BallLoader/BallLoader";
import Grid from "@mui/material/Grid2";

const HistoryWorldCup = () => {
  const params = useParams();
  const _userId = params.userId!;
  console.log(_userId);
  const isLoading = false;

  if (isLoading) return <BallLoader />;

  return (
    <Grid
      container
      justifyContent={"center"}
      alignContent={"center"}
      size={12}
      style={{
        minHeight: "700px",
        height: "calc(100vh - 56px)",
        overflowY: "scroll",
        overflowX: "hidden",
        color: "#00E2F6",
      }}
    >
      <Grid
        size={{ xs: 11, md: 8 }}
        style={{ textAlign: "center" }}
      >
        <h2 style={{ color: "#00E2F6", fontSize: "2rem" }}>History</h2>
        <p style={{ color: "#ffffff" }}>World Cup history — coming soon.</p>
      </Grid>
    </Grid>
  );
};

export default HistoryWorldCup;
