// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unsafe-optional-chaining */

import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./MyPortfolioEPL.module.css";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "../../components/EPLBallLoader/EPLBallLoader";
import { usePortfolioEplData } from "@/hooks/usePortfolioEplData";
import { usePortfolioEplActions } from "@/hooks/usePortfolioEplActions";

const MyPortfolioEPL = () => {
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId!;

  const {
    validTournament,
    setValidTournament,
    AllPortfolios,
    teamsComplete,
    numberInputs,
    teamsBloqued,
    selectedTeams,
    setSelectedTeams,
    teamsDynamics,
    weekParameter,
    tournamentId,
    isLoadingData,
  } = usePortfolioEplData(userId, sportId);

  const {
    areAllInputsValid,
    getSeed,
    getMultiplier,
    addportFolioAlert,
    cancelAlert,
  } = usePortfolioEplActions({
    userId,
    tournamentId,
    AllPortfolios,
    selectedTeams,
    numberInputs,
    setValidTournament,
    teamsDynamics,
    validTournament,
    weekParameter,
  });

  const checkNotValidTeam = (team: any) =>
    teamsBloqued.some((bloquedTeam) => bloquedTeam.id === team.id);

  const checkTeamSelected = (team: any) =>
    !!selectedTeams?.some((selectedTeam) => selectedTeam.id === team.id);

  const handleChangeSelect = (value: string, index: number) => {
    const newSelectedTeams = [...selectedTeams];
    newSelectedTeams[index] = teamsComplete.filter(
      (team) => team.name === value,
    )[0];
    setSelectedTeams(newSelectedTeams);
  };

  const renderTeams = () => {
    if (numberInputs === 0) {
      return (
        <p
          style={{
            color: "white",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "24px",
          }}
        >
          No teams are available for selection.
        </p>
      );
    }

    // console.log(AllPortfolios);

    return selectedTeams?.map((team, idx: number) => (
      <div
        key={idx}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          marginBottom: "20px",
          backgroundColor: idx % 2 === 0 ? "#380f65" : "#200930",
        }}
      >
        <div
          style={{
            backgroundColor: idx % 2 === 0 ? "#380f65" : "#200930",
            width: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#05fa87",
            fontWeight: "bold",
          }}
        >
          {getSeed(team)}
        </div>
        <FormControl
          fullWidth
          sx={{
            backgroundColor: idx % 2 === 0 ? "#380f65" : "#200930",
            "& .MuiInputLabel-root": {
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (team.disabled) {
              toast.error("This team is not available");
            }
          }}
        >
          <InputLabel
            id={`select-label-${idx}`}
            shrink={selectedTeams[idx] !== ""}
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
              transition: "opacity 0.2s",
            }}
          >
            Team
          </InputLabel>
          <Select
            labelId={`select-label-${idx}`}
            value={team.name || ""}
            label="Team"
            readOnly={checkNotValidTeam(team)}
            disabled={checkNotValidTeam(team)}
            onChange={(e) => handleChangeSelect(e.target.value, idx)}
            sx={{
              backgroundColor: checkNotValidTeam(team) && "#72598cff",
              opacity: checkNotValidTeam(team) && 0.7,
              "& .MuiSelect-icon": {
                color: checkNotValidTeam(team) ? "gray" : "white",
              },
            }}
          >
            {teamsComplete.map((opt) => (
              <MenuItem
                key={opt.id}
                value={opt.name || ""}
                disabled={checkNotValidTeam(opt) || checkTeamSelected(opt)}
                style={{ color: "white" }}
              >
                <div
                  className={classes.selectMio}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  <ListItemIcon style={{ color: "white" }}>
                    <img
                      src={opt.crest_url}
                      alt={opt.name}
                      style={{
                        width: 28,
                        height: 28,
                        objectFit: "contain",
                        marginRight: 8,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    style={{
                      color: opt.disabled ? "#595757ff" : "white",
                      textAlign: "left",
                      fontWeight: "bold",
                    }}
                  >
                    {opt.name}
                  </ListItemText>
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div
          style={{
            backgroundColor: idx % 2 === 0 ? "#380f65" : "#200930",
            width: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#05fa87",
            fontWeight: "bold",
          }}
        >
          {getMultiplier(team)}
        </div>
      </div>
    ));
  };

  if (isLoadingData) {
    return <Loader />;
  }

  return (
    <Grid
      container
      justifyContent={"center"}
      alignContent={"start"}
      size={12}
      style={{
        minHeight: "700px",
        height: "calc(100vh - 56px)",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
      className={`${classes.gridInstructions}`}
    >
      <Grid size={{ xs: 12, sm: 10, lg: 8 }}>
        <Box
          component="section"
          className={classes.boxPortfolio}
          m={3}
        >
          <div
            className={classes.headerPortfolio}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ color: "white" }}>
              <EmojiEventsOutlinedIcon
                color="inherit"
                style={{ fontSize: "2.6rem" }}
              />
              <h2 style={{ color: "#05fa87", fontSize: "40px" }}>
                My Portfolio
                <p
                  style={{
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "normal",
                  }}
                >
                  {validTournament ? validTournament[0]?.name : "Tournament"}
                </p>
              </h2>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            <p style={{ textAlign: "center", color: "#05fa87" }}>
              {AllPortfolios && AllPortfolios[0]?.name}
            </p>
            <Divider style={{ backgroundColor: "white", width: "60%" }} />
          </div>

          <Grid
            size={12}
            style={{ marginTop: "30px" }}
          >
            <div style={{ width: "80%", margin: "0 auto" }}>
              <Grid
                size={{ xs: 12 }}
                style={{
                  marginTop: "30px",
                  margin: "10px 0",
                  padding: "5px 10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#200930",
                }}
              >
                <Grid size={12}>Seed</Grid>
                <Grid
                  size={12}
                  style={{ textAlign: "right", fontWeight: "bold" }}
                >
                  Multiplier
                </Grid>
              </Grid>
              {renderTeams()}
            </div>
          </Grid>

          <Grid
            mt={3}
            mb={2}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: `${areAllInputsValid() ? "#05fa87" : "#0c5031ff"}`,
                  width: "30%",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "14px",
                  margin: 10,
                  "&:disabled": { backgroundColor: "grey" },
                }}
                onClick={() => addportFolioAlert()}
              >
                {AllPortfolios && AllPortfolios[0]?.teams?.length > 0
                  ? "EDIT"
                  : "SUBMIT"}
              </Button>
              <Button
                variant="contained"
                color="error"
                style={{
                  width: "30%",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "14px",
                  margin: 10,
                }}
                onClick={() => cancelAlert()}
              >
                Cancel
              </Button>
            </div>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MyPortfolioEPL;
