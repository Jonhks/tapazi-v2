// TODO: Adaptar de src/ncaa-male/views/myPortfolio/MyPortfolio.tsx
// Cambiar imports de API a @/api/worldcup/PortfoliosAPIWorldCup
// Los colores del TableBase ya vienen del tema worldcup en components/Table/Table.tsx
import { useParams } from "react-router-dom";
import BallLoader from "../../components/BallLoader/BallLoader";
import Grid from "@mui/material/Grid2";

const MyPortfolioWorldCup = () => {
  const params = useParams();
  const userId = params.userId!;

  // Placeholder mientras se conecta al API de worldcup
  const isLoading = false;
  console.log(userId);

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
        overflowY: "auto",
        overflowX: "hidden",
        color: "#00E2F6",
      }}
    >
      <Grid
        size={{ xs: 11, md: 8 }}
        style={{ textAlign: "center" }}
      >
        <h2 style={{ color: "#00E2F6", fontSize: "2rem" }}>My Portfolios</h2>
        <p style={{ color: "#ffffff" }}>World Cup portfolios — coming soon.</p>
      </Grid>
    </Grid>
  );
};

export default MyPortfolioWorldCup;
