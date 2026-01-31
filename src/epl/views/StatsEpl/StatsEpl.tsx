import { useState } from "react";
import classes from "./StatsEpl.module.css";
import { 
  FormControl, 
  FormControlLabel, 
  Radio, 
  RadioGroup, 
  Typography, 
  Zoom,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DropDownHistory from "../../components/Inputs/DropdDownHistory";
import Grid from "@mui/material/Grid2";
import { getStatsEpl } from "@/api/epl/StatsEplAPI";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/EPLBallLoader/EPLBallLoader";



// Custom styled components for the table to match the UI in the image
const StyledTableContainer = styled(TableContainer)(() => ({
  backgroundColor: "transparent",
  boxShadow: "none",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#0d0211",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#333",
    borderRadius: "10px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#555",
  },
}));

const StyledHeaderCell = styled(TableCell)(() => ({
  backgroundColor: "#22092c",
  color: "#ffffff",
  fontWeight: "bold",
  textAlign: "center",
  border: "none",
  padding: "16px 8px",
  fontSize: "0.85rem",
  textTransform: "uppercase",
}));

const StyledBodyCell = styled(TableCell)(() => ({
  color: "#ffffff",
  textAlign: "center",
  border: "none",
  padding: "12px 8px",
  fontSize: "0.9rem",
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#15051a",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#22092c",
  },
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
}));

const TeamDisplay = ({ name }: { name: string }) => (
  <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
    {/* Placeholder for team logo - in a real app these would be assets */}
    <Box sx={{ width: 24, height: 24, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "50%" }} />
    <Typography variant="body2" sx={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>{name}</Typography>
  </Box>
);

const StatsEpl = () => {
  const [tournament, setTournament] = useState("MEN'S BB TOURNAMENT 2025");
  const [dataType, setDataType] = useState("SCORE");
  const [scoreType, setScoreType] = useState("CURRENT SCORE");
  const [sortOrder, setSortOrder] = useState("Score (Desc)");

  // Mock data that matches the image provided by the user
  const tournaments = [{ id: "1", name: "MEN'S BB TOURNAMENT 2025" }];
  const dataTypes = [{ id: "1", name: "SCORE" }];
  const scoreTypes = [{ id: "1", name: "CURRENT SCORE" }];
   const params = useParams();
    const userId = params.userId!;


  
  const { data: statsEplData, isLoading } = useQuery({
    queryKey: ["statsEpl", userId],
    queryFn: () => getStatsEpl(),
  });

  console.log(statsEplData);



  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOrder((event.target as HTMLInputElement).value);
  };

  if (isLoading) return <Loader />;

  return (
    <Grid
      style={{
        minHeight: "700px",
        height: "calc(100vh - 56px)",
        overflow: "scroll",
      }}
    >
      <Grid
        container
        size={12}
        spacing={1}
        display={"flex"}
        justifyContent={"center"}
        alignContent={"center"}
        flexWrap={"nowrap"}
        sx={{ width: "100%", maxWidth: "100%" }}
      >
        <div className={`${classes.boxHistory} ${classes.active}`}>
          <div className={classes.titleBox} style={{ justifyContent: "center" }}>
            STATS
          </div>
          <div className={classes.subBoxHistory}>
            <Grid container spacing={4}>
              {/* Left Column: Dropdowns */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Grid container spacing={2} alignItems="center">
                  {/* Tournament Row */}
                  <Grid size={4}>
                    <Typography sx={{ color: "white", textAlign: "right", pr: 2 }}>
                      Tournament:
                    </Typography>
                  </Grid>
                  <Grid size={8}>
                    <DropDownHistory
                      name="tournament"
                      label=""
                      className={classes.DropDownHistory}
                      value={tournament}
                      handleChange={(e) => setTournament(e.target.value as string)}
                      options={tournaments}
                    />
                  </Grid>

                  {/* Data Row */}
                  <Grid size={4}>
                    <Typography sx={{ color: "white", textAlign: "right", pr: 2 }}>
                      Data:
                    </Typography>
                  </Grid>
                  <Grid size={8}>
                    <DropDownHistory
                      name="data"
                      label=""
                      className={classes.DropDownHistory}
                      value={dataType}
                      handleChange={(e) => setDataType(e.target.value as string)}
                      options={dataTypes}
                    />
                  </Grid>

                  {/* Score Row */}
                  <Grid size={4}>
                    <Typography sx={{ color: "white", textAlign: "right", pr: 2 }}>
                      Score:
                    </Typography>
                  </Grid>
                  <Grid size={8}>
                    <DropDownHistory
                      name="score"
                      label=""
                      className={classes.DropDownHistory}
                      value={scoreType}
                      handleChange={(e) => setScoreType(e.target.value as string)}
                      options={scoreTypes}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Right Column: Radio Buttons */}
              <Grid
                size={{ xs: 12, md: 5 }}
                display="flex"
                justifyContent="center"
              >
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={sortOrder}
                    onChange={handleSortChange}
                  >
                    <FormControlLabel
                      value="Score (Desc)"
                      control={
                        <Radio
                          sx={{
                            color: "white",
                            "&.Mui-checked": { color: "#05fa87" },
                          }}
                        />
                      }
                      label={
                        <Typography color="white">Score (Desc)</Typography>
                      }
                    />
                    <FormControlLabel
                      value="Portfolio (Asc)"
                      control={
                        <Radio
                          sx={{
                            color: "white",
                            "&.Mui-checked": { color: "#05fa87" },
                          }}
                        />
                      }
                      label={
                        <Typography color="white">Portfolio (Asc)</Typography>
                      }
                    />
                    <FormControlLabel
                      value="Weight (Desc)"
                      control={
                        <Radio
                          sx={{
                            color: "white",
                            "&.Mui-checked": { color: "#05fa87" },
                          }}
                        />
                      }
                      label={
                        <Typography color="white">Weight (Desc)</Typography>
                      }
                    />
                    <FormControlLabel
                      value="Weight (Asc)"
                      control={
                        <Radio
                          sx={{
                            color: "white",
                            "&.Mui-checked": { color: "#05fa87" },
                          }}
                        />
                      }
                      label={
                        <Typography color="white">Weight (Asc)</Typography>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </div>
      </Grid>
      
      <Grid
        container
        spacing={2}
        display={"flex"}
        justifyContent={"center"}
        alignContent={"center"}
        mt={2}
        mb={3}
      >
        <Zoom in={true}>
          <Grid size={11.5}>
            <Box sx={{ width: "100%", textAlign: "center", mb: 2 }}>
              <Typography variant="h5" sx={{ color: "white", fontWeight: "bold", textTransform: "uppercase" }}>
                Score
              </Typography>
            </Box>
            <Box sx={{ width: "100%", overflow: "hidden", borderRadius: "4px" }}>
              <StyledTableContainer sx={{ maxHeight: "60vh" }}>
                <Table stickyHeader aria-label="stats table" sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
                  <TableHead>
                    <TableRow>
                      {/* Left Sticky Headers */}
                      <StyledHeaderCell sx={{ color: "#05fa87", position: "sticky", left: 0, zIndex: 3, width: "100px", padding: "16px 4px" }}>Portfolio</StyledHeaderCell>
                      {/* <StyledHeaderCell sx={{ position: "sticky", left: "100px", zIndex: 3, width: "80px", padding: "16px 4px" }}>Weight</StyledHeaderCell> */}
                      
                      {/* Scrollable Team Headers */}
                      {[1, 2, 3, 4, 5, 6, 7, ].map((n) => (
                        <StyledHeaderCell key={n} sx={{ minWidth: "150px" }}>Team {n}</StyledHeaderCell>
                      ))}
                      
                      {/* Right Sticky Headers */}
                      <StyledHeaderCell sx={{ position: "sticky", right: "0px", zIndex: 3, width: "60px", padding: "16px 4px" }}>week score</StyledHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(statsEplData || []).map((row: any, index: number) => (
                      <StyledTableRow key={index}>
                        {/* Left Sticky Cells */}
                        <StyledBodyCell sx={{ color: "#05fa87", fontWeight: "bold", position: "sticky", left: 0, zIndex: 1, width: "", padding: "12px 4px", backgroundColor: index % 2 === 0 ? "#15051a" : "#22092c" }}>
                          {row.portfolio}
                        </StyledBodyCell>
                        {/* {
                          console.log(row.teams)
                        } */}
                        
                        {/* Scrollable Team Cells */}
                        {JSON.parse(row?.teams)?.map((team: string) => (
                          <StyledBodyCell key={team || ' '}>
                            <TeamDisplay name={team || ' ' } />
                          </StyledBodyCell>
                        ))}
                        
                        {/* Right Sticky Cells */}
                        <StyledBodyCell sx={{ position: "sticky", right: "0px", zIndex: 1, width: "60px", padding: "12px 4px", backgroundColor: index % 2 === 0 ? "#15051a" : "#22092c" }}>
                          {row.week_score}
                        </StyledBodyCell>
                        {/* <StyledBodyCell sx={{ position: "sticky", right: "140px", zIndex: 1, width: "60px", padding: "12px 4px", backgroundColor: index % 2 === 0 ? "#15051a" : "#22092c" }}>
                          {row.score}
                        </StyledBodyCell>
                        <StyledBodyCell sx={{ position: "sticky", right: 0, zIndex: 1, width: "140px", padding: "12px 4px", backgroundColor: index % 2 === 0 ? "#15051a" : "#22092c" }}>
                          {row.championshipPoints || row.points}
                        </StyledBodyCell> */}
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </Box>
          </Grid>
        </Zoom>
      </Grid>
    </Grid>
  );
};

export default StatsEpl;

