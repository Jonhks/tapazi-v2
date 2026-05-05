// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid2";
// import { BallIcon } from "@/assets/icons/icons";
import Dropdown from "@/shared/components/Inputs/Dropdown";
import classes from "../../views/myPortfolio/MyPortfolioWorldCup.module.css";
import { sportThemes } from "@/shared/theme/colors";
import { getMatchProbabilitiesWorldCup } from "@/api/worldcup/PortfoliosAPIWorldCup";

interface PortfolioTabWorldCupProps {
  portfolio;
  portfolioIndex: number;
  isActive: boolean;
  teams;
  isValidTournament: boolean;
  tournamentId?: string;
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
  tournamentId,
  onTeamSelect,
  onChampionshipPointsChange,
  onSave,
  onRemove,
  onCancel,
}) => {
  const [modalGroup, setModalGroup] = useState<string | null>(null);
  const [probData, setProbData] = useState([]);
  const [probLoading, setProbLoading] = useState(false);

  if (!isActive) return null;

  const isNewPortfolio = portfolio.newPortfolio;
  const isReadOnly = !isNewPortfolio;

  const handleGroupClick = async (groupName: string) => {
    if (!tournamentId) return;
    setModalGroup(groupName);
    setProbLoading(true);
    try {
      const result = await getMatchProbabilitiesWorldCup(tournamentId, groupName);
      setProbData(result);
    } finally {
      setProbLoading(false);
    }
  };

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
    <Box sx={{ py: 3 }}>
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
              <Chip
                label={`Group ${fullTeamData.group_name}`}
                size="small"
                clickable
                onClick={() => handleGroupClick(fullTeamData.group_name)}
                sx={{
                  ml: 2,
                  minWidth: "60px",
                  color: sportThemes.worldcup.accent,
                  border: `1px solid ${sportThemes.worldcup.accent}80`,
                  bgcolor: `${sportThemes.worldcup.accent}15`,
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor: `${sportThemes.worldcup.accent}35`,
                    border: `1px solid ${sportThemes.worldcup.accent}`,
                    boxShadow: `0 0 6px ${sportThemes.worldcup.accent}60`,
                  },
                }}
              />
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
      <Dialog
        open={!!modalGroup}
        onClose={() => setModalGroup(null)}
        PaperProps={{
          sx: {
            bgcolor: "#00292c",
            border: `1px solid ${sportThemes.worldcup.accent}`,
            borderRadius: "8px",
            minWidth: 320,
          },
        }}
      >
        <DialogTitle
          sx={{
            color: sportThemes.worldcup.accent,
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
          }}
        >
          Group {modalGroup} — Match Probabilities
          <IconButton
            onClick={() => setModalGroup(null)}
            size="small"
            sx={{ color: sportThemes.worldcup.accent }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          {probLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress sx={{ color: sportThemes.worldcup.accent }} size={32} />
            </Box>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      color: sportThemes.worldcup.accent,
                      textAlign: "left",
                      padding: "6px 8px",
                      borderBottom: `1px solid ${sportThemes.worldcup.accent}4D`,
                      fontSize: "0.85rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Place
                  </th>
                  <th
                    style={{
                      color: sportThemes.worldcup.accent,
                      textAlign: "left",
                      padding: "6px 8px",
                      borderBottom: `1px solid ${sportThemes.worldcup.accent}4D`,
                      fontSize: "0.85rem",
                    }}
                  >
                    Opponent Probabilities
                  </th>
                </tr>
              </thead>
              <tbody>
                {probData.map((row: any, i: number) => (
                  <tr key={i}>
                    <td
                      style={{
                        color: "#fff",
                        padding: "6px 8px",
                        borderBottom: `1px solid ${sportThemes.worldcup.accent}1A`,
                        fontSize: "0.85rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.place}
                    </td>
                    <td
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        padding: "6px 8px",
                        borderBottom: `1px solid ${sportThemes.worldcup.accent}1A`,
                        fontSize: "0.85rem",
                      }}
                    >
                      {row.vs_probabilities}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PortfolioTabWorldCup;
