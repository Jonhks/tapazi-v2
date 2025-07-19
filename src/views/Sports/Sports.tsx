import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./Sports.module.css";
import { useNavigate, useParams } from "react-router-dom";

export default function Sports() {
  const navigate = useNavigate();
  const params = useParams();

  console.log("params", params);

  return (
    <Grid
      container
      sx={{ height: "100vh" }}
    >
      {/* Lado izquierdo */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          backgroundImage:
            "url('https://s3.mx-central-1.amazonaws.com/portfolio.pool/epl/sport_selection/fondo_basket.jpg')",
          backgroundPosition: "right bottom",
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          padding: 4,
        }}
      >
        <Box
          sx={{
            backgroundImage:
              "url('https://s3.mx-central-1.amazonaws.com/portfolio.pool/epl/sport_selection/ncaa_male_on.png')",
            justifyContent: "right",
            alignItems: "center",
          }}
          className={classes.imgCard}
          onClick={() => {
            navigate(`/home/${params.userId}`);
          }}
        >
          NCAA MALE
        </Box>
        <Box
          sx={{
            backgroundImage:
              "url('https://s3.mx-central-1.amazonaws.com/portfolio.pool/epl/sport_selection/ncaa_female_on.png')",
            justifyContent: "left",
            alignItems: "center",
          }}
          className={classes.imgCard}
          onClick={() => {
            navigate(`/wip/${params.userId}`);
          }}
        >
          NCAA FEMALE
        </Box>
      </Grid>

      {/* Lado derecho */}
      <Grid
        // item
        size={{ xs: 12, md: 6 }}
        sx={{
          backgroundImage:
            "url('https://s3.mx-central-1.amazonaws.com/portfolio.pool/epl/sport_selection/fondo_football.jpg')",
          backgroundPosition: "left top",
          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          padding: 4,
        }}
      >
        <Box
          sx={{
            justifyContent: "center",
            alignItems: "center",
            backgroundImage:
              "url('https://s3.mx-central-1.amazonaws.com/portfolio.pool/epl/sport_selection/epl_on.png')",
          }}
          className={classes.imgCard}
          onClick={() => {
            navigate(`/wip/${params.userId}`);
          }}
        >
          <p>EPL</p>
        </Box>
        <Box
          sx={{
            backgroundImage:
              "url('https://s3.mx-central-1.amazonaws.com/portfolio.pool/epl/sport_selection/worldcup_on.png')",
            justifyContent: "right",
          }}
          className={classes.imgCard}
          onClick={() => {
            navigate(`/wip/${params.userId}`);
          }}
        >
          <p
            style={{
              height: "90%",
              display: "flex",
              alignItems: "end",
              justifyContent: "end",
            }}
          >
            WORLDCUP
          </p>
        </Box>
      </Grid>
    </Grid>
  );
}
