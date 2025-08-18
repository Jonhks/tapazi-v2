import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./InstructionsEpl.module.css";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Loader from "../../components/EPLBallLoader/EPLBallLoader";
import type { Instructions } from "@/types/index";
import { getInstructionsEpl } from "@/api/epl/InstructionsEplApi";

const InstructionsEpl = () => {
  const params = useParams();
  const userId = params.userId!;

  const { data: instructionsData, isLoading } = useQuery({
    queryKey: ["instructions", userId],
    queryFn: () => getInstructionsEpl("3"),
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
        className={classes.gridInstructions}
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
              className={classes.subBoxInstructions}
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
                    <p>
                      {paragrpah.description || "Sin información disponible"}
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

export default InstructionsEpl;
