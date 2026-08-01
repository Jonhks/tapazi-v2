import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./InstructionsNfl.module.css";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loader from "../../components/NFLBallLoader/NFLBallLoader";
import type { Instructions } from "@/types/index";
import { getInstructionsNfl } from "@/api/nfl/InstructionsNflApi";
import { getTournaments } from "@/api/nfl/HomeNflApiNfl";

const InstructionsNfl = () => {
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId!;

  const { data: tournamentsNfl } = useQuery({
    queryKey: ["tournaments", userId],
    queryFn: () => getTournaments(sportId),
    refetchOnWindowFocus: "always",
  });

  const tournamentIdNfl = tournamentsNfl && tournamentsNfl[0]?.id;

  const { data: instructionsData, isLoading } = useQuery({
    queryKey: ["instructions", userId, tournamentIdNfl],
    queryFn: () => getInstructionsNfl(tournamentIdNfl),
    enabled: Boolean(tournamentIdNfl),
  });

  if (isLoading) return <Loader />;

  if (instructionsData)
    return (
      <Grid
        container
        justifyContent={"center"}
        alignContent={"center"}
        size={12}
        style={{
          minHeight: "700px",
          height: "calc(100vh - 56px)",
          overflow: "scroll",
        }}
        className={`${classes.gridInstructions}`}
      >
        <Grid size={{ xs: 11, md: 8 }}>
          <Box
            component="section"
            className={classes.boxInstructions}
          >
            <p className={classes.titleInstructions}>
              {instructionsData[0].description || "Sin información disponible"}
            </p>
            <Grid
              size={12}
              className={`${classes.subBoxInstructions}`}
            >
              {instructionsData.map((paragrpah: Instructions, i: number) => (
                <div
                  key={i}
                  className={
                    paragrpah.highlighted
                      ? classes.highlighted
                      : classes.paragraph
                  }
                >
                  {i !== 0 && (
                    <p
                      style={{
                        margin: 0,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        textAlign: "center",
                        padding: "4px 8px",
                        fontSize: "14px",
                        fontFamily: "Raleway, sans-serif monospace",
                      }}
                    >
                      {(
                        paragrpah.description || "Sin información disponible"
                      ).replace(/\t/g, "  ")}
                    </p>
                  )}
                </div>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    );
};

export default InstructionsNfl;
