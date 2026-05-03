// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import { Box, Button, Input, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid2";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
// import { BallIcon } from "@/assets/icons/icons";
import Dropdown from "@/shared/components/Inputs/Dropdown";
import classes from "../../views/myPortfolio/MyPortfolioWorldCup.module.css";
import { sportThemes } from "@/shared/theme/colors";

interface PortfolioTabWorldCupProps {
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

const PortfolioTabWorldCup: React.FC<PortfolioTabWorldCupProps> = ({
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
    if (!isReadOnly) onTeamSelect(teamData, teamIndex);
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isReadOnly) onChampionshipPointsChange(e.target.value);
  };

  const selectedTeamNames =
    portfolio?.teams
      ?.map((t: any) => (typeof t === "object" && t ? t.name : t))
      .filter(Boolean) || [];

  return (
    <Box sx={{ p: 3 }}>
      {teams &&
        teams?.length > 0 &&
        teams[0]?.seed !== undefined &&
        teams[0]?.group_name && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 8px",
              marginTop: "16px",
              marginBottom: "8px",
              color: sportThemes.worldcup.accent,
              fontWeight: "bold",
              borderBottom: `1px solid ${sportThemes.worldcup.accent}4D`,
              paddingBottom: "8px",
            }}
          >
            <span style={{ minWidth: "20px", marginRight: "8px" }}>Seed</span>
            <span style={{ width: "28px", marginRight: "8px" }}></span>
            <span style={{ flexGrow: 1, paddingLeft: "8px" }}>Team</span>
            <span style={{ minWidth: "60px", textAlign: "right" }}>Group</span>
          </div>
        )}

      {portfolio?.teams?.map((team, teamIndex: number) => {
        const fullTeamData =
          typeof team === "object" && team?.id
            ? teams?.find((t: any) => t.id === team.id) || team
            : team;

        return (
          <div
            key={teamIndex}
            className={classes.containerDropdown}
            style={{ padding: "0 8px", marginBottom: "8px" }}
          >
            {typeof fullTeamData === "object" &&
            fullTeamData?.seed !== undefined ? (
              <span
                style={{
                  minWidth: "20px",
                  color: sportThemes.worldcup.textSecondary,
                  fontSize: "0.9rem",
                  marginRight: "8px",
                }}
              >
                {fullTeamData.seed}
              </span>
            ) : (
              <span style={{ minWidth: "20px", marginRight: "8px" }}></span>
            )}
            {typeof fullTeamData === "object" && fullTeamData?.crest_url ? (
              <img
                src={fullTeamData.crest_url}
                alt={fullTeamData.name || "team crest"}
                style={{
                  width: "28px",
                  height: "28px",
                  objectFit: "contain",
                  marginRight: "8px",
                }}
              />
            ) : (
              <span style={{ width: "28px", marginRight: "8px" }}></span>
            )}
            <div style={{ flexGrow: 1 }}>
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
                disabledOptions={selectedTeamNames}
              />
            </div>
            {typeof fullTeamData === "object" && fullTeamData?.group_name ? (
              <span
                style={{
                  color: sportThemes.worldcup.textSecondary,
                  fontSize: "0.9rem",
                  marginLeft: "16px",
                  minWidth: "60px",
                  textAlign: "right",
                }}
              >
                Group {fullTeamData.group_name}
              </span>
            ) : (
              <span style={{ marginLeft: "16px", minWidth: "60px" }}></span>
            )}
          </div>
        );
      })}

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
          {/* <Input
            // required
            type="text"
            value={portfolio.championship_points || portfolio.points || ""}
            sx={{ width: "80%", m: 1 }}
            id="championship-points-input"
            name="championshipPoints"
            readOnly={isReadOnly}
            placeholder="Championship Points"
            className={classes.championshipPoints}
            inputProps={{ maxLength: 3, inputMode: "numeric" }}
            startAdornment={
              <InputAdornment position="start">
                <EmojiEventsOutlinedIcon color="inherit" />
              </InputAdornment>
            }
            onChange={handlePointsChange}
          /> */}
        </Grid>
      </Grid>

      <Grid
        container
        m={2}
        justifyContent="end"
        spacing={2}
      >
        {isReadOnly ? (
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
          <>
            <Grid size={{ lg: 4, md: 4, xs: 12 }}>
              <Button
                variant="contained"
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

export default PortfolioTabWorldCup;
