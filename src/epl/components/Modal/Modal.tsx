// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import BallLoaderModal from "../EPLBallLoader/EPLBallLoaderModal";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getScorePeerWeekHomeEpl } from "@/api/epl/HomeEplApiEpl";
import { Typography, useMediaQuery } from "@mui/material";
import TableModal from "./TableModal";
import { NewPortfolio, ScorePortfoliosTable } from "@/types/index";
import { getTeamsEpl } from "@/api/epl/PortfoliosEplAPI";
import { useEffect, useState } from "react";

export default function ModalTableHome({
  openModal,
  setOpenModal,
  week,
  portfolioId,
  portfolio,
}: {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  week: string;
  portfolioId: string;
  portfolio: NewPortfolio;
}) {
  const params = useParams<{ userId: string }>();
  const userId = params.userId!;
  const isMobile = useMediaQuery("(max-width:700px)");

  const [teamsEplComplete, setTeamsEplComplete] = useState<
    ScorePortfoliosTable[]
  >([]);

  const {
    data: scorePeerWeekHomeEpl,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["scorePeerWeekHomeEpl", userId, week, portfolioId],
    queryFn: () =>
      getScorePeerWeekHomeEpl(week.toString(), portfolioId.toString()),
    enabled: Boolean(userId && week && portfolioId !== "1"), // Solo ejecuta la consulta si estos valores son válidos
  });

  const {
    data: teamsEplHome,
    isLoading: isLoadingTeamsEplHome,
    // isError,
  } = useQuery({
    queryKey: ["teamsEplHome", userId],
    queryFn: () => getTeamsEpl("2"),
    // enabled: Boolean(userId && week && portfolioId !== "1"), // Solo ejecuta la consulta si estos valores son válidos
  });

  useEffect(() => {
    if (scorePeerWeekHomeEpl && teamsEplHome) {
      const scorePeerWeekHomeEplWithCrest = scorePeerWeekHomeEpl.map(
        (item: ScorePortfoliosTable) => {
          const team = teamsEplHome.find(
            (t: ScorePortfoliosTable) => t?.id === item.team_id
          );
          return {
            ...item,
            crest_url: team?.crest_url || "qweqwewq", // Si no se encuentra, queda vacío
          };
        }
      );
      setTeamsEplComplete(scorePeerWeekHomeEplWithCrest);
    }
  }, [scorePeerWeekHomeEpl, teamsEplHome]);

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
    if (isLoading || isLoadingTeamsEplHome) {
      component = <BallLoaderModal />;
    }
    if (isError) {
      component = <ErrorModal />;
    }
    if (scorePeerWeekHomeEpl && teamsEplComplete && !isLoading && !isError) {
      component = (
        <TableModal
          data={teamsEplComplete ? teamsEplComplete : scorePeerWeekHomeEpl}
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
            bgcolor: "#2e034dff",
            border: "1px solid #6f09b7ff",
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
