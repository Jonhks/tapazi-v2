// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { postNewPortfolio, removeportfolio } from "@/api/PortfoliosAPI";

interface UsePortfolioActionsProps {
  userId: string;
  portfolios;
  setPortfolios: (portfolios) => void;
  setActiveTab: (tab: number) => void;
  setIsEditing: (editing: boolean) => void;
  isValidTournament: boolean;
  queryClient;
}

export const usePortfolioActions = ({
  userId,
  portfolios,
  setPortfolios,
  setActiveTab,
  setIsEditing,
  isValidTournament,
  queryClient,
}: UsePortfolioActionsProps) => {
  // Mutation para crear portfolio
  const { mutate: createPortfolio } = useMutation({
    mutationFn: postNewPortfolio, // Sin wrapper
    onSuccess: (response) => {
      toast.success(response);
      queryClient.invalidateQueries(["portfolios", userId]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutation para eliminar portfolio
  const { mutate: deletePortfolio } = useMutation({
    mutationFn: removeportfolio,
    onSuccess: (response) => {
      toast.success(response || "Portfolio removed successfully!");
      queryClient.invalidateQueries(["portfolios", userId]);
    },
    onError: (error) => {
      toast.error(error.message || "Error removing portfolio");
    },
  });

  // Agregar nuevo portfolio
  const handleAddPortfolio = () => {
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

  // Guardar portfolio
  const handleSavePortfolio = async () => {
    if (!isValidTournament) {
      toast.error("The tournament has already started!");
      return;
    }

    // Encontrar el portfolio en edición
    const portfolioToSave = portfolios.find((p) => p.newPortfolio);

    if (!portfolioToSave) {
      toast.error("No portfolio to save!");
      return;
    }

    // Validar puntos de campeonato
    const championshipPoints = Number(portfolioToSave.championship_points);
    if (!championshipPoints || championshipPoints < 1) {
      toast.error("Championship points must be at least 1!");
      return;
    }

    // Validar que todos los equipos estén seleccionados
    const hasUnselectedTeams = portfolioToSave.teams.some(
      (team) => team === false || !team,
    );

    if (hasUnselectedTeams) {
      toast.error("You must select all 8 teams!");
      return;
    }

    // Preparar datos para enviar
    const teamsToSend = portfolioToSave.teams
      .filter((team) => team && typeof team === "object" && team.id)
      .map((team) => ({
        id: team.id,
        seed: 1,
        streak_multiplier: 1,
      }));

    if (teamsToSend.length !== 8) {
      toast.error("All 8 teams must be properly selected!");
      return;
    }

    // Mostrar confirmación
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
      const portfolioData = {
        tournament_id: 1,
        participant_id: Number(userId),
        championship_points: championshipPoints,
        teams: teamsToSend,
      };

      console.log("Sending portfolio data:", portfolioData);

      createPortfolio(portfolioData);
      setIsEditing(false);

      await Swal.fire({
        title: "Saved!",
        text: "Your portfolio has been saved.",
        icon: "success",
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      await Swal.fire({
        title: "Cancelled",
        text: "Don't worry, you can still continue editing your portfolio :)",
        icon: "info",
      });
    }
  };

  // Eliminar portfolio
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
      // Actualizar UI inmediatamente
      const updatedPortfolios = portfolios.filter((p) => p.id !== portfolioId);
      setPortfolios(updatedPortfolios);

      // Ajustar tab activo
      if (portfolioIndex > 0) {
        setActiveTab(portfolioIndex - 1);
      } else {
        setActiveTab(0);
      }

      // Eliminar del backend
      deletePortfolio({
        portId: portfolioId,
        portfolios,
        userId,
      });

      await Swal.fire({
        title: "Deleted!",
        text: "Your portfolio has been deleted.",
        icon: "success",
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      await Swal.fire({
        title: "Cancelled",
        text: "Your portfolio is safe :)",
        icon: "info",
      });
    }
  };

  // Cancelar edición
  const handleCancelPortfolio = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "All changes will be lost!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No, keep editing!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      // Remover el portfolio nuevo
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
