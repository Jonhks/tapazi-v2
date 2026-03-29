// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getPortfoliosWorldCup,
  getTeamsWorldCup,
  getDATTOUWorldCup,
  getHOUTOUWorldCup,
  getWinnerOfTeamWorldCup,
  getWinnerOfTeamHasTeamWorldCup,
} from "@/api/worldcup/PortfoliosAPIWorldCup";
import { getTournamentWorldCup } from "@/api/worldcup/HomeAPIWorldCup";
import { isDateTimeReached } from "@/utils/getDaysLeft";

export const usePortfolioWorldCupData = (userId: string) => {
  const [isValidTournament, setIsValidTournament] = useState(true);
  const [winnerTeamValidation, setWinnerTeamValidation] = useState([]);

  const { data: tournamentWorldCup, isLoading: isLoadingTournament } = useQuery({
    queryKey: ["tournamentWorldCup"],
    queryFn: () => getTournamentWorldCup("4"), // sportId de worldcup
    enabled: !!userId,
  });

  const currentTournamentWorldCup = tournamentWorldCup?.[0];

  const { data: portfoliosData, isLoading: isLoadingPortfolios } = useQuery({
    queryKey: ["portfoliosWorldCup", userId],
    queryFn: () => getPortfoliosWorldCup(userId, currentTournamentWorldCup?.id),
    enabled: !!currentTournamentWorldCup?.id,
    retry: true,
  });

  const {
    data: teamsData,
    isLoading: isLoadingTeams,
    refetch: refetchTeams,
  } = useQuery({
    queryKey: ["teamsWorldCup", userId],
    queryFn: () => getTeamsWorldCup(currentTournamentWorldCup?.id),
    enabled: !!currentTournamentWorldCup?.id,
    refetchInterval: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: dataDATTOU } = useQuery({
    queryKey: ["dattouWorldCup", userId],
    queryFn: () => getDATTOUWorldCup(currentTournamentWorldCup?.id),
    enabled: !!currentTournamentWorldCup?.id,
    retry: true,
  });

  const { data: dataHOUTOU } = useQuery({
    queryKey: ["houtouWorldCup", userId],
    queryFn: () => getHOUTOUWorldCup(currentTournamentWorldCup?.id),
    enabled: !!currentTournamentWorldCup?.id,
    retry: true,
  });

  const { data: winnerOfTeam } = useQuery({
    queryKey: ["winnerOfTeamWorldCup", userId],
    queryFn: () => getWinnerOfTeamWorldCup(currentTournamentWorldCup?.id),
    enabled: !!currentTournamentWorldCup?.id,
    retry: false,
  });

  useEffect(() => {
    if (dataDATTOU && dataHOUTOU) {
      const isValid = isDateTimeReached(dataDATTOU, dataHOUTOU);
      setIsValidTournament(isValid);
    }
  }, [dataDATTOU, dataHOUTOU]);

  useEffect(() => {
    if (winnerOfTeam) {
      Promise.all(
        winnerOfTeam.map((winner) =>
          getWinnerOfTeamHasTeamWorldCup(currentTournamentWorldCup?.id, winner.team_id),
        ),
      ).then((responses) => {
        const formattedData = winnerOfTeam.map((winner, index) => ({
          winnerOfTeam: winner.team_id,
          winnerOfTeamHasTeam: responses[index]?.map((team) => team.team_id),
        }));
        setWinnerTeamValidation(formattedData);
      });
    }
  }, [winnerOfTeam]);

  return {
    portfoliosData,
    teamsData,
    refetchTeams,
    isLoading: isLoadingTournament || isLoadingPortfolios || isLoadingTeams,
    isValidTournament,
    winnerTeamValidation,
    currentTournamentWorldCup,
  };
};
