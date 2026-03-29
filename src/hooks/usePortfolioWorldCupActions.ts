// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  postNewPortfolioWorldCup,
  removePortfolioWorldCup,
} from "@/api/worldcup/PortfoliosAPIWorldCup";

interface UsePortfolioWorldCupActionsProps {
  userId: string;
  portfolios;
  setPortfolios: (portfolios) => void;
  setActiveTab: (tab: number) => void;
  setIsEditing: (editing: boolean) => void;
  isValidTournament: boolean;
  queryClient;
  refetchTeams: () => void;
  tournamentId?: number;
}

export const usePortfolioWorldCupActions = ({
  userId,
  portfolios,
  setPortfolios,
  setActiveTab,
  setIsEditing,
  isValidTournament,
  queryClient,
  refetchTeams,
  tournamentId,
}: UsePortfolioWorldCupActionsProps) => {
  const { mutate: createPortfolio } = useMutation({
    mutationFn: postNewPortfolioWorldCup,
    onSuccess: (response) => {
      toast.success(response);
      queryClient.invalidateQueries(["portfoliosWorldCup", userId]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: deletePortfolio } = useMutation({
    mutationFn: removePortfolioWorldCup,
    onSuccess: () => {
      toast.success("Portfolio removed successfully!");
      queryClient.invalidateQueries(["portfoliosWorldCup", userId]);
    },
    onError: (error) => {
      toast.error(error.message || "Error removing portfolio");
    },
  });

  const handleAddPortfolio = () => {
    refetchTeams();
    const newPortfolio = {
      newPortfolio: true,
      teams: Array(8).fill(false),
      championship_points: "",
    };
    const updatedPortfolios = [...portfolios, newPortfolio];
    setPortfolios(updatedPortfolios);
    setActiveTab(updatedPortfolios.length - 1);
    setIsEditing(true);
  };

  const handleSavePortfolio = async () => {
    if (!isValidTournament) {
      toast.error("The tournament has already started!");
      return;
    }

    const portfolioToSave = portfolios.find((p) => p.newPortfolio);
    if (!portfolioToSave) {
      toast.error("No portfolio to save!");
      return;
    }

    const championshipPoints = Number(portfolioToSave.championship_points);
    if (!championshipPoints || championshipPoints < 1) {
      toast.error("Championship points must be at least 1!");
      return;
    }

    const hasUnselectedTeams = portfolioToSave.teams.some(
      (team) => team === false || !team,
    );
    if (hasUnselectedTeams) {
      toast.error("You must select all 8 teams!");
      return;
    }

    const teamsToSend = portfolioToSave.teams
      .filter((team) => team && typeof team === "object" && team.id)
      .map((team) => ({ id: team.id, seed: 1, streak_multiplier: 1 }));

    if (teamsToSend.length !== 8) {
      toast.error("All 8 teams must be properly selected!");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      confirmButtonColor: "#00929e",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      background: "rgba(0, 41, 44, 0.95)",
      color: "#fff",
    });

    if (result.isConfirmed) {
      createPortfolio({
        tournament_id: tournamentId,
        participant_id: Number(userId),
        championship_points: championshipPoints,
        teams: teamsToSend,
      });
      setIsEditing(false);

      await Swal.fire({
        title: "Saved!",
        text: "Your portfolio has been saved.",
        icon: "success",
        confirmButtonColor: "#00929e",
        background: "rgba(0, 41, 44, 0.95)",
        color: "#fff",
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      await Swal.fire({
        title: "Cancelled",
        text: "Don't worry, you can still continue editing :)",
        icon: "info",
        background: "rgba(0, 41, 44, 0.95)",
        color: "#fff",
      });
    }
  };

  const handleRemovePortfolio = async (portfolioId: number) => {
    if (!isValidTournament) {
      toast.error("The tournament has already started!");
      return;
    }

    const portfolioIndex = portfolios.findIndex((p) => p.id === portfolioId);

    const result = await Swal.fire({
      title: `Are you sure to delete portfolio ${portfolioId}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00929e",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      background: "rgba(0, 41, 44, 0.95)",
      color: "#fff",
    });

    if (result.isConfirmed) {
      const updatedPortfolios = portfolios.filter((p) => p.id !== portfolioId);
      setPortfolios(updatedPortfolios);
      setActiveTab(portfolioIndex > 0 ? portfolioIndex - 1 : 0);
      deletePortfolio({ portId: portfolioId });

      await Swal.fire({
        title: "Deleted!",
        text: "Your portfolio has been deleted.",
        icon: "success",
        confirmButtonColor: "#00929e",
        background: "rgba(0, 41, 44, 0.95)",
        color: "#fff",
      });
    }
  };

  const handleCancelPortfolio = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "All changes will be lost!",
      icon: "warning",
      showCancelButton: true,
      background: "rgba(0, 41, 44, 0.95)",
      confirmButtonColor: "#00929e",
      color: "#fff",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep editing!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setPortfolios(portfolios.filter((p) => !p.newPortfolio));
      setActiveTab(0);
      setIsEditing(false);

      await Swal.fire({
        title: "Cancelled!",
        text: "Changes have been discarded.",
        icon: "success",
        confirmButtonColor: "#00929e",
        background: "rgba(0, 41, 44, 0.95)",
        color: "#fff",
      });
    }
  };

  return {
    handleAddPortfolio,
    handleSavePortfolio,
    handleRemovePortfolio,
    handleCancelPortfolio,
  };
};
