import { Box, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./Sports.module.css";
import { useNavigate, useParams } from "react-router-dom";

export default function Sports() {
  const navigate = useNavigate();
  const params = useParams();

  return (
    <Grid
      container
      sx={{ height: "100vh" }}
    >
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          backgroundImage:
            "url('https://s3.mx-central-1.amazonaws.com/portfolio.pool/sport_selection/fondo_basket.jpg?quality=80&format=webp')",
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
        <Tooltip title="NCAA MALE">
          <Box
            sx={{
              backgroundImage:
                "url('https://s3.mx-central-1.amazonaws.com/portfolio.pool/sport_selection/ncaa_male_on.png?quality=80&format=webp')",
              justifyContent: "right",
              alignItems: "center",
              textAlign: "center",
            }}
            className={classes.imgCard}
            onClick={() => {
              navigate(`/home/${params.userId}`);
            }}
          >
            <p>NCAA MALE</p>
          </Box>
        </Tooltip>
        <Tooltip title="NCAA FEMALE">
          <Box
            sx={{
              backgroundImage:
                "url('https://s3.mx-central-1.amazonaws.com/portfolio.pool/sport_selection/ncaa_female_on.png?quality=80&format=webp')",
              justifyContent: "left",
              alignItems: "center",
            }}
            className={classes.imgCard}
            onClick={() => {
              navigate(`/wip/${params.userId}/nacca-female`);
            }}
          >
            <p style={{ paddingLeft: 15 }}>NCAA FEMALE</p>
          </Box>
        </Tooltip>
      </Grid>

      <Grid
        // item
        size={{ xs: 12, md: 6 }}
        sx={{
          backgroundImage:
            "url('https://s3.mx-central-1.amazonaws.com/portfolio.pool/sport_selection/fondo_football.jpg?quality=80&format=webp')",
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
        <Tooltip title="English Premier League">
          <Box
            sx={{
              justifyContent: "center",
              alignItems: "center",
              backgroundImage:
                "url('https://s3.mx-central-1.amazonaws.com/portfolio.pool/sport_selection/epl_on.png?quality=80&format=webp')",
            }}
            className={classes.imgCard}
            onClick={() => {
              const userData = JSON.parse(
                localStorage.getItem("userTapaszi") || "{}"
              );
              const encodedData = btoa(JSON.stringify(userData));
              window.location.href = `https://tapaszi-epl.vercel.app/${params.userId}?data=${encodedData}`;
            }}
          >
            <p>EPL</p>
          </Box>
        </Tooltip>
        <Tooltip title="WORLDCUP">
          <Box
            sx={{
              backgroundImage:
                "url('https://s3.mx-central-1.amazonaws.com/portfolio.pool/sport_selection/worldcup_on.png?quality=80&format=webp')",
              justifyContent: "right",
            }}
            className={classes.imgCard}
            onClick={() => {
              navigate(`/wip/${params.userId}/worldcup`);
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
        </Tooltip>
      </Grid>
    </Grid>
  );
}
