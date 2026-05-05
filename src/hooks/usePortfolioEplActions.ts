// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  postNewPortfolioEpl,
  postEditPortfolio,
} from "@/api/epl/PortfoliosEplAPI";

interface UsePortfolioEplActionsProps {
  userId: string;
  tournamentId: string | null;
  AllPortfolios: any[];
  selectedTeams: any[];
  numberInputs: number | any[];
  setValidTournament: (val: any) => void;
  teamsDynamics: any[];
  validTournament: any[];
  weekParameter: number | null;
}

export const usePortfolioEplActions = ({
  userId,
  tournamentId,
  AllPortfolios,
  selectedTeams,
  numberInputs,
  setValidTournament,
  teamsDynamics,
  validTournament,
  weekParameter,
}: UsePortfolioEplActionsProps) => {
  const queryClient = useQueryClient();

  const { mutate: postNewPortfolioMutate } = useMutation({
    mutationFn: postNewPortfolioEpl,
    onSuccess: () => {
      Swal.close();
      Swal.fire({
        title: "Saved!",
        text: "Your portfolio was created successfully.",
        icon: "success",
        background: "#421065",
        confirmButtonColor: "#3ED076",
        color: "white",
      });
      queryClient.refetchQueries();
    },
    onError: () => {
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "There was a problem creating the portfolio.",
        icon: "error",
        background: "#421065",
        confirmButtonColor: "#c7630b",
        color: "white",
      });
    },
  });

  const { mutate: postEditPortfolioMutate } = useMutation({
    mutationFn: postEditPortfolio,
    onSuccess: () => {
      Swal.close();
      Swal.fire({
        title: "Updated!",
        text: "Your portfolio was updated successfully.",
        icon: "success",
        background: "#421065",
        confirmButtonColor: "#3ED076",
        color: "white",
      });
      queryClient.refetchQueries();
    },
    onError: () => {
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "There was a problem updating the portfolio.",
        icon: "error",
        background: "#421065",
        confirmButtonColor: "#c7630b",
        color: "white",
      });
    },
  });

  const areAllInputsValid = () =>
    selectedTeams?.length === numberInputs &&
    selectedTeams.every((team) => team && team.name);

  // Devuelve el seed correcto según la semana y el estado del portfolio
  const getSeed = (team: any) => {
    let seed = "";
    const currentTeamDynamics = teamsDynamics?.filter(
      (t) => t?.id === team?.id,
    )[0];
    const currentTeamPortfolios = AllPortfolios[0]?.teams?.filter(
      (t) => t?.id === team?.id,
    )[0];

    if (
      !AllPortfolios?.length &&
      !AllPortfolios[0]?.teams?.length &&
      team &&
      weekParameter === validTournament?.[0]?.current_round
    ) {
      return team?.seed;
    }

    if (
      AllPortfolios &&
      AllPortfolios[0]?.teams?.length > 0 &&
      weekParameter === validTournament?.[0]?.current_round
    ) {
      if (team) {
        seed = currentTeamPortfolios?.current_seed
          ? currentTeamPortfolios?.current_seed
          : team?.seed;
        return seed;
      }
    }

    if (
      !AllPortfolios.length &&
      !AllPortfolios[0]?.teams?.length > 0 &&
      team &&
      weekParameter !== validTournament?.[0]?.current_round
    ) {
      return team?.seed;
    }

    if (AllPortfolios && !AllPortfolios[0]?.teams?.length > 0) {
      if (team && weekParameter !== validTournament?.[0]?.current_round) {
        seed = currentTeamDynamics?.current_seed
          ? currentTeamDynamics?.current_seed
          : team?.seed;
      }
    }

    if (
      AllPortfolios.length &&
      AllPortfolios[0]?.teams?.length > 0 &&
      weekParameter !== validTournament?.[0]?.current_round
    ) {
      if (team) {
        seed = currentTeamPortfolios?.current_seed
          ? currentTeamPortfolios?.current_seed
          : currentTeamDynamics?.current_seed;
        return seed;
      }
    }

    return seed;
  };

  // Devuelve el multiplicador correcto según la semana y el estado del portfolio
  const getMultiplier = (team: any) => {
    let multiplier = "";
    const currentTeamDynamics = teamsDynamics?.filter(
      (t) => t?.id === team?.id,
    )[0];
    const currentTeamPortfolios = AllPortfolios[0]?.teams?.filter(
      (t) => t?.id === team?.id,
    )[0];

    if (team && weekParameter === validTournament?.[0]?.current_round) {
      return "1";
    }

    if (
      !AllPortfolios.length &&
      !AllPortfolios[0]?.teams?.length > 0 &&
      team &&
      weekParameter !== validTournament?.[0]?.current_round
    ) {
      return "1";
    }

    if (
      AllPortfolios.length &&
      AllPortfolios[0]?.teams?.length > 0 &&
      team &&
      weekParameter !== validTournament?.[0]?.current_round
    ) {
      multiplier = currentTeamPortfolios?.current_streak
        ? currentTeamPortfolios?.current_streak
        : currentTeamDynamics?.current_streak;
      return multiplier;
    }

    if (
      AllPortfolios &&
      !AllPortfolios[0]?.teams?.length > 0 &&
      team &&
      weekParameter !== validTournament?.[0]?.current_round
    ) {
      multiplier = currentTeamPortfolios?.current_streak
        ? currentTeamPortfolios?.current_streak
        : currentTeamDynamics?.current_streak;
      return multiplier;
    }

    if (
      AllPortfolios.length &&
      AllPortfolios[0]?.teams?.length > 0 &&
      weekParameter !== validTournament?.[0]?.current_round
    ) {
      if (team) {
        multiplier = currentTeamPortfolios?.current_streak
          ? currentTeamPortfolios?.current_streak
          : currentTeamDynamics?.current_streak;
        return multiplier;
      }
    }

    return multiplier;
  };

  const showErrorEnCero = async () => {
    const result = await Swal.fire({
      title: "Error!",
      text: "There are 0 seeds, please wait a few minutes",
      icon: "error",
      showCancelButton: false,
      confirmButtonColor: "#3ED076",
      color: "white",
      background: "#200930",
      confirmButtonText: "Ok",
    });
    if (result.isConfirmed) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  const addportFolio = useCallback(() => {
    const allFilled = areAllInputsValid();
    if (!allFilled) {
      toast.error("You must select all teams!");
      setValidTournament(true);
      setTimeout(() => {
        setValidTournament(false);
      }, 2500);
      return;
    }

    const newPortfolio = {
      tournament_id: tournamentId,
      participant_id: userId,
      championship_points: 0,
      teams: selectedTeams.map((team) => ({
        id: team.id,
        seed: getSeed(team),
        streak_multiplier: getMultiplier(team),
      })),
    };

    const estaEn0 = newPortfolio.teams?.some(
      (port) => port.seed === 0 || port.streak_multiplier === "0",
    );

    if (estaEn0) {
      showErrorEnCero();
      return;
    }

    if (AllPortfolios?.length === 0) {
      postNewPortfolioMutate({
        port: newPortfolio,
        userId,
        portId: AllPortfolios[0]?.id,
      });
      return;
    }

    if (AllPortfolios?.length > 0) {
      postEditPortfolioMutate({
        port: newPortfolio.teams,
        portId: AllPortfolios[0]?.id,
      });
    }
  }, [selectedTeams, userId, AllPortfolios, tournamentId]);

  const addportFolioAlert = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to save changes",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3ED076",
      cancelButtonColor: "#c7630b",
      color: "white",
      background: "#200930",
      confirmButtonText: "Yes, I want to save changes!",
    });
    if (result.isConfirmed) {
      await addportFolio();
    }
  };

  const cancelAlert = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to discard changes",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3ED076",
      cancelButtonColor: "#c7630b",
      color: "white",
      background: "#200930",
      confirmButtonText: "Yes, I want to discard changes!",
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    });
  };

  return {
    areAllInputsValid,
    getSeed,
    getMultiplier,
    addportFolio,
    addportFolioAlert,
    cancelAlert,
  };
};
