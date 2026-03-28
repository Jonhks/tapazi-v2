// TODO: Adaptar de src/ncaa-male/views/Stats/Stats.tsx
// Cambiar imports de API a @/api/worldcup/StatsAPIWorldCup
// Cambiar imports de Table a worldcup/components/Table/Table
import { useParams } from "react-router-dom";
import BallLoader from "../../components/BallLoader/BallLoader";
import Grid from "@mui/material/Grid2";

const StatsWorldCup = () => {
  const params = useParams();
  const _userId = params.userId!;

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
        overflowX: "scroll",
        color: "#00E2F6",
      }}
    >
      <Grid size={{ xs: 11, md: 8 }} style={{ textAlign: "center" }}>
        <h2 style={{ color: "#00E2F6", fontSize: "2rem" }}>Stats</h2>
        <p style={{ color: "#ffffff" }}>
          World Cup stats — coming soon.
        </p>
      </Grid>
    </Grid>
  );
};

export default StatsWorldCup;
