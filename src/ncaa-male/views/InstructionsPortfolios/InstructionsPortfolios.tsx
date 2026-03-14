import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./InstructionsPortfolios.module.css";
import { useQuery } from "@tanstack/react-query";
import { getInstructions, getTournamentMale } from "@/api/HomeAPI";
import { useParams } from "react-router-dom";
import Loader from "../../components/BallLoader/BallLoader";
import type { Instructions } from "@/types/index";

const Instructions = () => {
  const params = useParams();
  const userId = params.userId!;

  const { data: tournamentData, isLoading: isLoadingTournament } = useQuery({
    queryKey: ["tournametMaleInstruccions", userId],
    queryFn: () => getTournamentMale("1"),
  });

  const currentTournament = tournamentData && tournamentData[0];

  // console.log(currentTournament);

  const { data: instructionsData, isLoading } = useQuery({
    queryKey: ["instructions", userId, currentTournament],
    queryFn: () => getInstructions(currentTournament?.id.toString() ?? ""),
    enabled: !!currentTournament?.id,
  });

  if (isLoading || isLoadingTournament) return <Loader />;

  const renderDescription = (description: string) => {
    return description
      .split("\n")
      .map((line, index) => <p key={index}>{line}</p>);
  };

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
          overflowY: "auto",
          overflowX: "hidden",
        }}
        className={`${classes.gridInstructions} enable-vertical-scroll`}
      >
        <Grid size={{ xs: 11, md: 8 }}>
          <Box
            component="section"
            className={classes.boxInstructions}
          >
            <p className={classes.titleInstructions}>
              {instructionsData?.[0]?.description}
            </p>
            <Grid
              size={12}
              className={`${classes.subBoxInstructions} enable-vertical-scroll enable-horizontal-scroll`}
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
                  {i !== 0 && renderDescription(paragrpah.description)}
                </div>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    );
};

export default Instructions;
