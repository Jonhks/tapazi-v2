// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  postNewPortfolio,
  getPortfoliosFemale,
} from "@/api/female/PortfoliosAPIFemale";
import { softRemovePortfolio } from "@/api/ncaa-male/PortfoliosAPI";
import {
  getWalletRemaining,
  buyPortfolio,
  participantRemovePortfolio,
} from "@/api/WalletAPI";
import { getParameter } from "@/api/shared/TournamentsAPI";

export const usePortfolioFemaleActions = ({
  userId,
  portfolios,
  setPortfolios,
  setValue,
  setEditing,
  setChampionshipPoints,
  setFocused,
  setError,
  isValidTournament,
  currentTournamentFemale,
  queryClient,
  refetchTeams,
}) => {
  const { mutateAsync } = useMutation({
    mutationFn: postNewPortfolio,
  });


  // Verifica saldo antes de abrir el formulario
  const addportFolio = async () => {
    const tournamentId = currentTournamentFemale?.id;
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
        });
        return;
      }
    } catch (error) {
      toast.error(error?.message || "Could not verify wallet balance.");
      return;
    }

    refetchTeams();
    setValue(portfolios?.length);
    setEditing(true);
    const newData = [...portfolios];
    newData.push({
      newPortfolio: true,
      teams: [false, false, false, false, false, false, false, false],
      points: "",
    });
    setPortfolios(newData);
  };

  const savePortfolio = async () => {
    if (!isValidTournament) {
      toast.error("The tournament has already started!!");
      return;
    }

    const portFolioEditable = [
      ...portfolios?.filter((p) => p?.newPortfolio),
    ][0];
    const portfoliExist = portFolioEditable?.teams?.some((el) => el === false);

    if (portFolioEditable?.points >= 1 && !portfoliExist) {
      const teamsId = portFolioEditable?.teams?.map((el) => {
        if (typeof el === "object") return { id: el.id };
      });

      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        confirmButtonColor: "#238b94",
        showCancelButton: true,
        confirmButtonText: "Yes, send it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        try {
          const tournamentId = currentTournamentFemale?.id;
          const sendData = {
            tournament_id: tournamentId,
            participant_id: userId,
            championship_points: portFolioEditable.points,
            teams: teamsId.map((team) => ({
              ...team,
              seed: 0,
              streak_multiplier: 0,
            })),
          };

          const oldIds = new Set(
            portfolios.filter((p) => p.id).map((p) => p.id),
          );

          await mutateAsync(sendData);

          const freshPortfolios = await getPortfoliosFemale(
            userId,
            String(tournamentId),
          );
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
            queryClient.invalidateQueries(["portfoliosFEMALE", userId]);
            await Swal.fire({
              title: "Purchase Failed",
              text: buyResult.message || "Could not complete the purchase.",
              icon: "error",
              confirmButtonColor: "#238b94",
            });
            return;
          }

          queryClient.invalidateQueries(["portfoliosFEMALE", userId]);
          queryClient.invalidateQueries(["wallet-remaining", userId]);
          setChampionshipPoints("");
          setFocused(false);
          setError(false);
          setEditing(false);

          await Swal.fire({
            title: "Saved!",
            text: "your portfolio has been saved.",
            icon: "success",
          });
        } catch (error) {
          toast.error(error?.message || "Error saving portfolio");
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Don't worry, you can still continue editing your portfolio :)",
          icon: "error",
        });
      }
    } else if (
      portFolioEditable?.points >= 1 &&
      portFolioEditable?.teams?.some((el) => el === false)
    ) {
      setError(true);
      setTimeout(() => setError(false), 1000);
      toast.error("You must select all Teams!");
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
      toast.error("All fields are mandatory!!");
    }
  };

  const removeportfolioFunction = async (portId: number) => {
    const index = portfolios.findIndex((p) => p.id === portId);
    setValue(index);

    const result = await Swal.fire({
      title: `Are you sure to delete the portfolio ${portId}`,
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
        const tournamentId = currentTournamentFemale?.id;
        await participantRemovePortfolio(userId, String(tournamentId), portId);
        await softRemovePortfolio({ portId, tournamentId: String(tournamentId) });

        queryClient.invalidateQueries(["portfoliosFEMALE", userId]);
        queryClient.invalidateQueries(["wallet-remaining", userId]);

        const updatedPortfolios = portfolios.filter((el) => el.id !== portId);
        setPortfolios(updatedPortfolios);
        setValue(index > 0 ? index - 1 : 0);

        await Swal.fire({
          title: "Deleted!",
          text: "Your portfolio has been deleted.",
          icon: "success",
        });
      } catch (error) {
        toast.error(error?.message || "Error removing portfolio");
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: "Cancelled",
        text: "Don't worry, you can still continue editing your portfolio :)",
        icon: "error",
      });
      setValue(index);
    }
  };

  const cancelPortfolio = async (portfoliosObtained) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setValue(0);
      setPortfolios(portfoliosObtained);
      setEditing(false);
      await Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: "Cancelled",
        text: "Don't worry, you can still continue editing your portfolio :)",
        icon: "error",
      });
    }
  };

  return {
    addportFolio,
    savePortfolio,
    removeportfolioFunction,
    cancelPortfolio,
  };
};
