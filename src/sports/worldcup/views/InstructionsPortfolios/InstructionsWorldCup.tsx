import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./InstructionsPortfolios.module.css";
import { useQuery } from "@tanstack/react-query";
import { getInstructions, getTournamentWorldCup } from "@/api/worldcup/HomeAPIWorldCup";
import { useParams } from "react-router-dom";
import Loader from "../../components/BallLoader/BallLoader";
import type { Instructions } from "@/types/index";

const InstructionsWorldCup = () => {
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId!;

  const { data: tournamentData, isLoading: isLoadingTournament } = useQuery({
    queryKey: ["tournamentWorldCupInstructions", userId, sportId],
    queryFn: () => getTournamentWorldCup(sportId),
  });

  const currentTournament = tournamentData && tournamentData[0];

  const { data: instructionsData, isLoading } = useQuery({
    queryKey: ["instructionsWorldCup", userId, currentTournament],
    queryFn: () => getInstructions(currentTournament?.id),
    enabled: !!currentTournament?.id,
  });

  if (isLoading || isLoadingTournament) return <Loader />;

  const renderDescription = (description: string) => {
    return description.split("\n").map((line, index) => <p key={index}>{line}</p>);
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
          overflowY: "scroll",
          overflowX: "hidden",
        }}
        className={`${classes.gridInstructions}`}
      >
        <Grid size={{ xs: 11, md: 8 }}>
          <Box component="section" className={classes.boxInstructions}>
            <p className={classes.titleInstructions}>
              {instructionsData[0].description}
            </p>
            <Grid
              size={12}
              className={`${classes.subBoxInstructions}`}
            >
              {instructionsData.map((paragraph: Instructions, i: number) => (
                <div
                  key={i}
                  className={paragraph.highlighted ? classes.highlighted : classes.paragraph}
                >
                  {i !== 0 && renderDescription(paragraph.description)}
                </div>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    );
};

export default InstructionsWorldCup;
