// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getDATTOU,
  getHOUTOUFemale,
  getPortfoliosFemale,
  getTeamsFemale,
  getWinnerOfTeam,
  getWinnerOfTeamHasTeam,
} from "@/api/female/PortfoliosAPI";
import { getTournamentFemale } from "@/api/female/HomeAPIFemale";
import { isDateTimeReached } from "@/utils/getDaysLeft";

/**
 * Hook para manejar toda la carga de datos relacionada con los portafolios femeninos.
 */
export const usePortfolioFemaleData = (userId: string) => {
  const [isValidTournament, setIsValidTournament] = useState(true);
  const [winnerTeamValidation, setWinnerTeamValidation] = useState([]);

  // Obtener el torneo actual (mujeres usa el ID '3')
  const { data: tournamentFemale, isLoading: isLoadingTournament } = useQuery({
    queryKey: ["tournamentFemale", userId],
    queryFn: () => getTournamentFemale("3"),
    enabled: !!userId,
  });

  const currentTournamentFemale = tournamentFemale?.[0];

  // Obtener portfolios de la usuaria
  const { data: portfoliosObtained, isLoading: isLoadingPortfolios } = useQuery({
    queryKey: ["portfoliosFEMALE", userId],
    queryFn: () => getPortfoliosFemale(userId, currentTournamentFemale?.id),
    enabled: !!currentTournamentFemale?.id,
    retry: true,
  });

  // Obtener equipos femeninos
  const { data: teamsFemale, isLoading: isLoadingTeams } = useQuery({
    queryKey: ["teamsFemale", userId],
    queryFn: () => getTeamsFemale(currentTournamentFemale?.id),
    enabled: !!currentTournamentFemale?.id,
    cacheTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
  });

  // Obtener parámetros del torneo (fechas límite)
  const { data: dataDATTOU } = useQuery({
    queryKey: ["dattou", userId],
    queryFn: () => getDATTOU(userId),
  });

  const { data: dataHOUTOUFemale } = useQuery({
    queryKey: ["houtouFemale", userId],
    queryFn: () => getHOUTOUFemale(currentTournamentFemale?.id),
    enabled: !!currentTournamentFemale?.id,
    retry: true,
  });

  // Obtener reglas de equipos ganadores
  const { data: winnerOfTeamData } = useQuery({
    queryKey: ["winnerOfTeam", userId],
    queryFn: () => getWinnerOfTeam(),
  });

  // Validar si el torneo ya empezó (mantenemos lógica comentada si estaba así, pero organizada)
  useEffect(() => {
    if (dataDATTOU && dataHOUTOUFemale) {
      const isValid = isDateTimeReached(dataDATTOU, dataHOUTOUFemale);
      setIsValidTournament(isValid);
    }
  }, [dataDATTOU, dataHOUTOUFemale]);

  // Procesar validaciones de equipos ganadores
  useEffect(() => {
    if (winnerOfTeamData) {
      Promise.all(
        winnerOfTeamData.map((el) => getWinnerOfTeamHasTeam(el.id))
      ).then((resp) => {
        const formattedData = winnerOfTeamData.map((winner, index) => ({
          winnerOfTeam: winner.id,
          winnerOfTeamHasTeam: resp[index].map((team) => team.teamId),
        }));
        setWinnerTeamValidation(formattedData);
      });
    }
  }, [winnerOfTeamData]);

  return {
    currentTournamentFemale,
    portfoliosObtained,
    teamsFemale,
    isValidTournament,
    winnerTeamValidation,
    isLoading: isLoadingTournament || isLoadingPortfolios || isLoadingTeams,
  };
};
