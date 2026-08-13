// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import BallLoaderModal from "../NFLBallLoader/NFLBallLoaderModal";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getScorePeerWeekHomeNfl } from "@/api/nfl/HomeNflApiNfl";
import { Typography, useMediaQuery } from "@mui/material";
import TableModal from "./TableModal";
import { NewPortfolio, ScorePortfoliosTable } from "@/types/index";
import { getTeamsNfl } from "@/api/nfl/PortfoliosNflAPI";
import { useEffect, useState } from "react";

export default function ModalTableHome({
  openModal,
  setOpenModal,
  week,
  portfolioId,
  portfolio,
  tournamentId,
}: {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  week: string;
  portfolioId: string;
  portfolio: NewPortfolio;
  tournamentId?: string;
}) {
  const params = useParams<{ userId: string; sportId: string }>();
  const userId = params.userId!;
  const sportId = params.sportId || "5"; // TODO: confirmar sportId real de NFL con el backend
  const isMobile = useMediaQuery("(max-width:700px)");

  const [teamsNflComplete, setTeamsNflComplete] = useState<
    ScorePortfoliosTable[]
  >([]);

  const {
    data: scorePeerWeekHomeNfl,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["scorePeerWeekHomeNfl", userId, week, portfolioId],
    queryFn: () =>
      getScorePeerWeekHomeNfl(week.toString(), portfolioId.toString()),
    enabled: Boolean(userId && week && portfolioId !== "1"), // Solo ejecuta la consulta si estos valores son válidos
  });

  const {
    data: teamsNflHome,
    isLoading: isLoadingTeamsNflHome,
  } = useQuery({
    queryKey: ["teamsNflHome", userId],
    queryFn: () => getTeamsNfl(sportId, tournamentId ?? ""),
  });

  useEffect(() => {
    if (scorePeerWeekHomeNfl && teamsNflHome) {
      const scorePeerWeekHomeNflWithCrest = scorePeerWeekHomeNfl.map(
        (item: ScorePortfoliosTable) => {
          const team = teamsNflHome.find(
            (t: ScorePortfoliosTable) => t?.id === item.team_id
          );
          return {
            ...item,
            crest_url: team?.crest_url || "", // Si no se encuentra, queda vacío
          };
        }
      );
      setTeamsNflComplete(scorePeerWeekHomeNflWithCrest);
    }
  }, [scorePeerWeekHomeNfl, teamsNflHome]);

  const ErrorModal = () => {
    return (
      <div style={{ padding: "20px", textAlign: "center", height: "100%" }}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
        >
          Error
        </Typography>
        <Typography
          id="modal-modal-description"
          sx={{ mt: 2 }}
        >
          No teams Found
        </Typography>
      </div>
    );
  };

  const renderComponent = () => {
    let component = <BallLoaderModal />;
    if (isLoading || isLoadingTeamsNflHome) {
      component = <BallLoaderModal />;
    }
    if (isError) {
      component = <ErrorModal />;
    }
    if (scorePeerWeekHomeNfl && !isLoading && !isError) {
      component = (
        <TableModal
          data={teamsNflComplete.length > 0 ? teamsNflComplete : scorePeerWeekHomeNfl}
        />
      );
    }
    return component;
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
            minWidth: isMobile ? "90%" : 600,
            maxWidth: "90%",
            bgcolor: "#141414",
            border: "1px solid #D4AF37",
            boxShadow: 24,
            p: 2,
            overflow: "hidden",
            borderRadius: "10px",
            color: "white",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <h3>Portfolio: {portfolio?.name || "Unknown Portfolio"}</h3>
            <h3>Week: {week}</h3>
          </div>
          {renderComponent()}
        </Box>
      </Modal>
    </div>
  );
}
