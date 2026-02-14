// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getPortfolios,
  getTeamsMale as getTeams,
  getDATTOU,
  getHOUTOU,
  getWinnerOfTeam,
  getWinnerOfTeamHasTeam,
} from "@/api/PortfoliosAPI";
import { isDateTimeReached } from "@/utils/getDaysLeft";
import { getTournamentMale } from "@/api/HomeAPI";

export const usePortfolioData = (userId: string) => {
  const [isValidTournament, setIsValidTournament] = useState(true);
  const [winnerTeamValidation, setWinnerTeamValidation] = useState([]);

  const { data: tournamentMale, isLoading: isLoadingTournamentMale } = useQuery({
    queryKey: ["tournamentMale"],
    queryFn: () => getTournamentMale('1'),
    retry: true,
  });

  const currenttournamentMale = tournamentMale &&  tournamentMale?.[0];
  // console.log(currenttournamentMale); 

  // Obtener portfolios
  const { data: portfoliosData, isLoading: isLoadingPortfolios } = useQuery({
    queryKey: ["portfolios", userId],
    queryFn: () => getPortfolios(userId, currenttournamentMale?.id),
    enabled: !!currenttournamentMale,
    retry: true,
  });

  // Obtener equipos
  const { data: teamsData, isLoading: isLoadingTeams } = useQuery({
    queryKey: ["teams", userId],
    queryFn: () => getTeams(),
    staleTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
  });

  // Obtener fechas del torneo
  const { data: dataDATTOU } = useQuery({
    queryKey: ["dattou", userId],
    queryFn: () => getDATTOU(userId),
  });

  const { data: dataHOUTOU } = useQuery({
    queryKey: ["houtou", userId],
    queryFn: () => getHOUTOU(userId),
  });

  // Obtener ganadores de equipo
  const { data: winnerOfTeam } = useQuery({
    queryKey: ["winnerOfTeam", userId],
    queryFn: () => getWinnerOfTeam(),
  });

  // Validar fechas del torneo
  useEffect(() => {
    if (dataDATTOU && dataHOUTOU) {
      const isValid = isDateTimeReached(dataDATTOU, dataHOUTOU);
      setIsValidTournament(isValid);
    }
  }, [dataDATTOU, dataHOUTOU]);

  // Procesar datos de ganadores
  useEffect(() => {
    if (winnerOfTeam) {
      Promise.all(
        winnerOfTeam.map((winner) => getWinnerOfTeamHasTeam(winner.id)),
      ).then((responses) => {
        const formattedData = winnerOfTeam.map((winner, index) => ({
          winnerOfTeam: winner.id,
          winnerOfTeamHasTeam: responses[index].map((team) => team.teamId),
        }));
        setWinnerTeamValidation(formattedData);
      });
    }
  }, [winnerOfTeam]);

  return {
    portfoliosData,
    teamsData,
    isLoading: isLoadingPortfolios || isLoadingTeams,
    isValidTournament,
    winnerTeamValidation,
    currenttournamentMale
  };
};
