// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  postNewPortfolio,
  getPortfolios,
  softRemovePortfolio,
} from "@/api/ncaa-male/PortfoliosAPI";
import {
  getWalletRemaining,
  buyPortfolio,
  participantRemovePortfolio,
} from "@/api/WalletAPI";
import { getParameter } from "@/api/shared/TournamentsAPI";

interface UsePortfolioActionsProps {
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

export const usePortfolioActions = ({
  userId,
  portfolios,
  setPortfolios,
  setActiveTab,
  setIsEditing,
  isValidTournament,
  queryClient,
  refetchTeams,
  tournamentId,
}: UsePortfolioActionsProps) => {
  const { mutateAsync: createPortfolio } = useMutation({
    mutationFn: postNewPortfolio,
  });


  // Verifica saldo antes de abrir el formulario
  const handleAddPortfolio = async () => {
    if (!tournamentId) return;

    try {
      const [walletRemaining, prcxpo] = await Promise.all([
        getWalletRemaining(userId),
        getParameter(String(tournamentId), "PRCXPO"),
      ]);
      const price = Number(prcxpo) || 0;
      if (walletRemaining < price) {
        await Swal.fire({
          title: "Insufficient Balance",
          text: `You need $${price} to add a portfolio. Your current balance is $${walletRemaining}.`,
          icon: "error",
          confirmButtonColor: "#238b94",
          background: "#000",
          color: "#fff",
        });
        return;
      }
    } catch (error) {
      toast.error(error?.message || "Could not verify wallet balance.");
      return;
    }

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
      confirmButtonColor: "#238b94",
      showCancelButton: true,
      confirmButtonText: "Yes, save it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const portfolioData = {
          tournament_id: tournamentId,
          participant_id: Number(userId),
          championship_points: championshipPoints,
          teams: teamsToSend,
        };

        const oldIds = new Set(portfolios.filter((p) => p.id).map((p) => p.id));

        await createPortfolio(portfolioData);

        const freshPortfolios = await getPortfolios(userId, String(tournamentId));
        const newPortfolio = freshPortfolios?.find((p) => !oldIds.has(p.id));

        if (!newPortfolio?.id) {
          toast.error("Portfolio created but could not retrieve its ID.");
          return;
        }

        const buyResult = await buyPortfolio(
          userId,
          String(tournamentId),
          newPortfolio.id,
        );

        if (!buyResult.success) {
          await softRemovePortfolio({ portId: newPortfolio.id, tournamentId: String(tournamentId) });
          queryClient.invalidateQueries(["portfolios", userId]);
          await Swal.fire({
            title: "Purchase Failed",
            text: buyResult.message || "Could not complete the purchase.",
            icon: "error",
            confirmButtonColor: "#238b94",
            background: "#000",
            color: "#fff",
          });
          return;
        }

        queryClient.invalidateQueries(["portfolios", userId]);
        queryClient.invalidateQueries(["wallet-remaining", userId]);
        setIsEditing(false);

        await Swal.fire({
          title: "Saved!",
          text: "Your portfolio has been saved.",
          icon: "success",
          confirmButtonColor: "#238b94",
        });
      } catch (error) {
        toast.error(error?.message || "Error saving portfolio");
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      await Swal.fire({
        title: "Cancelled",
        text: "Don't worry, you can still continue editing your portfolio :)",
        icon: "info",
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
      confirmButtonColor: "#238b94",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await participantRemovePortfolio(userId, String(tournamentId), portfolioId);
        await softRemovePortfolio({ portId: portfolioId, tournamentId: String(tournamentId) });

        queryClient.invalidateQueries(["portfolios", userId]);
        queryClient.invalidateQueries(["wallet-remaining", userId]);

        const updatedPortfolios = portfolios.filter((p) => p.id !== portfolioId);
        setPortfolios(updatedPortfolios);
        setActiveTab(portfolioIndex > 0 ? portfolioIndex - 1 : 0);

        await Swal.fire({
          title: "Deleted!",
          text: "Your portfolio has been deleted.",
          icon: "success",
        });
      } catch (error) {
        toast.error(error?.message || "Error removing portfolio");
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      await Swal.fire({
        title: "Cancelled",
        text: "Your portfolio is safe :)",
        icon: "info",
      });
    }
  };

  const handleCancelPortfolio = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "All changes will be lost!",
      icon: "warning",
      iconColor: "white",
      showCancelButton: true,
      background: "#000",
      confirmButtonColor: "#238b94",
      color: "white",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep editing!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const updatedPortfolios = portfolios.filter((p) => !p.newPortfolio);
      setPortfolios(updatedPortfolios);
      setActiveTab(0);
      setIsEditing(false);

      await Swal.fire({
        title: "Cancelled!",
        text: "Changes have been discarded.",
        icon: "success",
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
