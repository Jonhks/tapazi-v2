import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { leagueThemes } from "@/theme/leagues";

const { accentColor } = leagueThemes.worldcup;

// TODO: implementar similar a InstructionsFemale / InstructionsEpl
const InstructionsWorldCup = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="80vh"
    >
      <Typography variant="h5" sx={{ color: accentColor }}>
        Instructions — World Cup (coming soon)
      </Typography>
    </Box>
  );
};

export default InstructionsWorldCup;
