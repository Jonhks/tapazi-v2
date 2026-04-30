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
} from "@/api/ncaa-male/PortfoliosAPI";
import { isDateTimeReached } from "@/utils/getDaysLeft";
import { getTournamentMale } from "@/api/ncaa-male/HomeAPI";
import { log } from "console";

export const usePortfolioData = (userId: string) => {
  const [isValidTournament, setIsValidTournament] = useState(true);
  const [winnerTeamValidation, setWinnerTeamValidation] = useState([]);

  const { data: tournamentMale, isLoading: isLoadingTournamentMale } = useQuery(
    {
      queryKey: ["tournamentMale"],
      queryFn: () => getTournamentMale("1"),
      retry: 1,
    },
  );

  const currenttournamentMale = tournamentMale && tournamentMale?.[0];
  // console.log(currenttournamentMale);

  // Obtener portfolios
  const { data: portfoliosData, isLoading: isLoadingPortfolios } = useQuery({
    queryKey: ["portfolios", userId],
    queryFn: () => getPortfolios(userId, currenttournamentMale?.id),
    enabled: !!currenttournamentMale,
    retry: 1,
  });

  // Obtener equipos
  const {
    data: teamsData,
    isLoading: isLoadingTeams,
    refetch: refetchTeams,
  } = useQuery({
    queryKey: ["teamsMale", userId],
    queryFn: () => getTeams(currenttournamentMale?.id),
    enabled: !!currenttournamentMale,
    refetchInterval: 60 * 1000, // Refetch cada 1 minuto
    refetchOnWindowFocus: false,
  });

  // Obtener fechas del torneo
  const { data: dataDATTOU } = useQuery({
    queryKey: ["dattou", userId],
    queryFn: () => getDATTOU(currenttournamentMale?.id),
    enabled: !!currenttournamentMale,
    retry: 1,
  });

  const { data: dataHOUTOU } = useQuery({
    queryKey: ["houtou", userId],
    queryFn: () => getHOUTOU(currenttournamentMale?.id),
    enabled: !!currenttournamentMale,
    retry: 1,
  });

  // console.log("asdmakñsdaksk", dataHOUTOU, dataDATTOU, "api");

  // Obtener ganadores de equipo
  const { data: winnerOfTeam } = useQuery({
    queryKey: ["winnerOfTeam", userId],
    queryFn: () => getWinnerOfTeam(currenttournamentMale?.id),
    enabled: !!currenttournamentMale,
    retry: 1,
  });

  // Validar fechas del torneo
  useEffect(() => {
    if (dataDATTOU && dataHOUTOU) {
      const isValid = isDateTimeReached(dataDATTOU, dataHOUTOU);
      // console.log("isValid", isValid);

      setIsValidTournament(isValid);
    }
  }, [dataDATTOU, dataHOUTOU]);

  // Procesar datos de ganadores
  useEffect(() => {
    if (winnerOfTeam) {
      Promise.all(
        winnerOfTeam?.map((winner) =>
          getWinnerOfTeamHasTeam(currenttournamentMale?.id, winner.team_id),
        ),
      ).then((responses) => {
        console.log("responses", responses[0]);
        const formattedData = winnerOfTeam?.map((winner, index) => ({
          winnerOfTeam: winner.team_id,
          winnerOfTeamHasTeam: responses[index]?.map((team) => team.team_id),
        }));
        setWinnerTeamValidation(formattedData);
      });
    }
  }, [winnerOfTeam]);

  // console.log("currenttournamentMale", currenttournamentMale);

  return {
    portfoliosData,
    teamsData,
    refetchTeams,
    isLoading: isLoadingPortfolios || isLoadingTeams,
    isValidTournament,
    winnerTeamValidation,
    currenttournamentMale,
  };
};
