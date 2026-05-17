import { Box, Button, Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const user = JSON.parse(localStorage.getItem("userTapaszi") || "{}");

  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="md">
        <Grid
          container
          spacing={2}
        >
          <Grid
            size={{ xs: 12, md: 12 }}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography
              variant="h1"
              style={{ color: "white" }}
            >
              404
            </Typography>
            <Typography
              variant="h6"
              style={{ color: "white" }}
            >
              The page you’re looking for doesn’t exist.
            </Typography>
            <Button
              variant="contained"
              style={{
                backgroundColor: "var(--primary)",
              }}
              onClick={() =>
                navigate(`/epl/home/${user.id}`, {
                  replace: true,
                })
              }
            >
              Back Home qweqwe
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
