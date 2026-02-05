// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import { Box, Button, Input, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid2";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { BallIcon } from "@/assets/icons/icons";
import Dropdown from "../components/Inputs/Dropdown";
import classes from "../views/myPortfolio/MyPortfolio.module.css";

interface PortfolioTabProps {
  portfolio;
  portfolioIndex: number;
  isActive: boolean;
  teams;
  isValidTournament: boolean;
  onTeamSelect: (teamData, teamIndex: number) => void;
  onChampionshipPointsChange: (value: string) => void;
  onSave: () => void;
  onRemove: (portfolioId: number) => void;
  onCancel: () => void;
}

const PortfolioTab: React.FC<PortfolioTabProps> = ({
  portfolio,
  portfolioIndex,
  isActive,
  teams,
  isValidTournament,
  onTeamSelect,
  onChampionshipPointsChange,
  onSave,
  onRemove,
  onCancel,
}) => {
  if (!isActive) return null;

  const isNewPortfolio = portfolio.newPortfolio;
  const isReadOnly = !isNewPortfolio;

  const handleTeamChange = (teamData, teamIndex: number) => {
    if (!isReadOnly) {
      onTeamSelect(teamData, teamIndex);
    }
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isReadOnly) {
      onChampionshipPointsChange(e.target.value);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Selección de equipos */}
      {portfolio.teams.map((team, teamIndex: number) => (
        <div
          key={teamIndex}
          className={classes.containerDropdown}
        >
          <BallIcon />
          <Dropdown
            disabled={isReadOnly}
            indexPortfolio={portfolioIndex}
            indexTeam={teamIndex}
            name={`team-${teamIndex}`}
            label={`Selection ${teamIndex + 1}`}
            value={typeof team === "object" && team ? team.name : ""}
            options={isReadOnly ? portfolio.teams : teams}
            handleChange={(selectedTeam) =>
              handleTeamChange(selectedTeam, teamIndex)
            }
          />
        </div>
      ))}

      {/* Championship Points Input */}
      <Grid
        container
        display="flex"
        justifyContent="end"
        sx={{ mt: 2 }}
      >
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Input
            required
            type="text"
            value={portfolio.championship_points || ""}
            sx={{ width: "80%", m: 1 }}
            id="championship-points-input"
            name="championshipPoints"
            readOnly={isReadOnly}
            placeholder="Championship Points"
            className={classes.championshipPoints}
            inputProps={{
              maxLength: 3,
              inputMode: "numeric",
            }}
            startAdornment={
              <InputAdornment position="start">
                <EmojiEventsOutlinedIcon color="inherit" />
              </InputAdornment>
            }
            onChange={handlePointsChange}
          />
        </Grid>
      </Grid>

      {/* Botones de acción */}
      <Grid
        container
        m={2}
        justifyContent="end"
        spacing={2}
      >
        {isReadOnly ? (
          // Portfolio guardado - mostrar botón de eliminar
          isValidTournament && (
            <Grid size={{ lg: 4, md: 4, xs: 12 }}>
              <Button
                variant="contained"
                color="warning"
                fullWidth
                className={classes.btnRemove}
                onClick={() => onRemove(portfolio.id)}
              >
                Remove
              </Button>
            </Grid>
          )
        ) : (
          // Portfolio nuevo - mostrar botones de guardar y cancelar
          <>
            <Grid size={{ lg: 4, md: 4, xs: 12, backgroundColor: "#05fa87" }}>
              <Button
                variant="contained"
                // color="success"
                fullWidth
                className={classes.btnSubmit}
                onClick={onSave}
              >
                Submit
              </Button>
            </Grid>
            <Grid size={{ lg: 4, md: 4, xs: 12 }}>
              <Button
                variant="contained"
                color="error"
                fullWidth
                className={classes.btnCancel}
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default PortfolioTab;
