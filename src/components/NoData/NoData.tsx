import { Box, Typography } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import type { SvgIconComponent } from "@mui/icons-material";

type NoDataProps = {
  message?: string;
  subMessage?: string;
  Icon?: SvgIconComponent;
};

const NoData = ({
  message = "No data available",
  subMessage,
  Icon = InboxIcon,
}: NoDataProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={1}
      py={6}
      sx={{ opacity: 0.6 }}
    >
      <Icon sx={{ fontSize: 48, color: "#eaad2b" }} />
      <Typography
        variant="body1"
        sx={{ color: "white", fontWeight: "bold", textTransform: "uppercase" }}
      >
        {message}
      </Typography>
      {subMessage && (
        <Typography variant="body2" sx={{ color: "white" }}>
          {subMessage}
        </Typography>
      )}
    </Box>
  );
};

export default NoData;
