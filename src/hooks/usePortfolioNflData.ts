// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getTournamentsId,
  getPortfoliosNfl,
  getTeamsNfl,
  getNumberTEAMXP,
  getTeamsNotAvailable,
  getTeamsDynamics,
  getParameterWeek,
  getAvailableByeTeamsPerPortfolio,
  getPortfolioPerWeek,
} from "@/api/nfl/PortfoliosNflAPI";
import { getParameter } from "@/api/shared/TournamentsAPI";
import { isEditableBeforeCutoff, getEditCutoffDate } from "@/utils/getDaysLeft";

const WEEK_PARAM_KEY = "WEETOU";
const MAX_BYE_TEAMS_PARAM_KEY = "BYTEPO";
const TOURNAMENT_DATE_PARAM_KEY = "DATTOU";
const TOURNAMENT_HOUR_PARAM_KEY = "HOUTOU";
const EDIT_CUTOFF_MINUTES = 5;

export const usePortfolioNflData = (userId: string, sportId: string) => {
  const [validTournament, setValidTournament] = useState([]);
  const [AllPortfolios, setAllPortfolios] = useState([]);
  const [teamsComplete, setTeamsComplete] = useState([]);
  const [numberInputs, setNumberInputs] = useState([]);
  const [teamsBloqued, setTeamsBloqued] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [weekParameter, setWeekParameter] = useState(null);
  const [availableByeTeams, setAvailableByeTeams] = useState([]);
  const [maxByeTeams, setMaxByeTeams] = useState(0);
  const [isEditableTime, setIsEditableTime] = useState(true);

  // 1. Torneos del sport → de aquí sacamos el tournamentId dinámico
  const { data: tournament, isLoading: isLoadingTournament } = useQuery({
    queryKey: ["nflTournament", sportId],
    queryFn: () => getTournamentsId(sportId),
    refetchOnWindowFocus: "always",
    enabled: Boolean(sportId),
  });

  const tournamentId: string | null = tournament?.[0]?.id
    ? String(tournament[0].id)
    : null;

  // 2. Portfolios del participante para este torneo
  const { data: portfolios, isLoading: isLoadingPortfolios } = useQuery({
    queryKey: ["nflPortfolios", userId, tournamentId],
    queryFn: () => getPortfoliosNfl(userId, "0", tournamentId!),
    refetchOnWindowFocus: "always",
    enabled: Boolean(userId && tournamentId),
  });

  // 3. Equipos no disponibles
  const { data: teamsNotAvailable, isLoading: isLoadingTeamsNotAvailable } =
    useQuery({
      queryKey: ["nflTeamsNotAvailable", sportId, tournamentId],
      queryFn: () => getTeamsNotAvailable(sportId, tournamentId!),
      refetchInterval: 60 * 1000,
      refetchOnWindowFocus: "always",
      enabled: Boolean(sportId && tournamentId),
    });

  // 4. Todos los equipos del sport
  const { data: teamsNFL, isLoading: isLoadingTeams } = useQuery({
    queryKey: ["nflTeams", sportId],
    queryFn: () => getTeamsNfl(sportId, tournamentId!),
    refetchOnWindowFocus: "always",
    enabled: Boolean(userId && sportId && tournamentId),
  });

  // 5. Cantidad de inputs (slots de equipo) permitidos por el torneo
  const { data: numberInputsReceived, isLoading: isLoadingNumberInputs } =
    useQuery({
      queryKey: ["nflNumberInputs", tournamentId],
      queryFn: () => getNumberTEAMXP(tournamentId!),
      refetchOnWindowFocus: "always",
      enabled: Boolean(tournamentId),
    });

  // 6. Dinámicas de equipos (seeds y multiplicadores actuales)
  const { data: teamsDynamics, isLoading: isLoadingTeamsDynamics } = useQuery({
    queryKey: ["nflTeamsDynamics", userId, portfolios, weekParameter],
    queryFn: () =>
      getTeamsDynamics(sportId, portfolios?.[0]?.id || "0", tournamentId!),
    refetchOnWindowFocus: "always",
    retry: 1,
    enabled: Boolean(
      userId &&
      portfolios?.length > 0 &&
      validTournament.length > 0 &&
      tournamentId &&
      validTournament[0]?.current_round !== weekParameter,
    ),
  });

  // 7. Semana actual del torneo
  const { data: weekParameterData, isLoading: isLoadingWeekParameter } =
    useQuery({
      queryKey: ["nflWeekParameter", tournamentId],
      queryFn: () => getParameterWeek(tournamentId!, WEEK_PARAM_KEY),
      refetchOnWindowFocus: "always",
      enabled: Boolean(tournamentId),
    });

  // 8. Equipos de bye que sí se pueden seleccionar en este portfolio
  // (porque ya estaban seleccionados en una semana anterior)
  const {
    data: availableByeTeamsData,
    isLoading: isLoadingAvailableByeTeams,
  } = useQuery({
    queryKey: ["nflAvailableByeTeams", userId, portfolios, tournamentId],
    queryFn: () =>
      getAvailableByeTeamsPerPortfolio(
        sportId,
        tournamentId!,
        portfolios?.[0]?.id || "0",
      ),
    refetchOnWindowFocus: "always",
    retry: 1,
    enabled: Boolean(userId && sportId && tournamentId && portfolios?.length > 0),
  });

  // 9. Máximo de equipos de bye seleccionables por portfolio (parámetro BYTEPO)
  const { data: maxByeTeamsData, isLoading: isLoadingMaxByeTeams } = useQuery({
    queryKey: ["nflMaxByeTeams", tournamentId],
    queryFn: () => getParameterWeek(tournamentId!, MAX_BYE_TEAMS_PARAM_KEY),
    refetchOnWindowFocus: "always",
    enabled: Boolean(tournamentId),
  });

  // 10. Fecha/hora de arranque del torneo (DATTOU/HOUTOU) — a partir de
  // EDIT_CUTOFF_MINUTES antes de ese momento ya no se puede editar el portfolio.
  const { data: tournamentDateData } = useQuery({
    queryKey: ["nflTournamentDate", tournamentId],
    queryFn: () => getParameter(tournamentId!, TOURNAMENT_DATE_PARAM_KEY),
    refetchOnWindowFocus: "always",
    enabled: Boolean(tournamentId),
  });

  const { data: tournamentHourData } = useQuery({
    queryKey: ["nflTournamentHour", tournamentId],
    queryFn: () => getParameter(tournamentId!, TOURNAMENT_HOUR_PARAM_KEY),
    refetchOnWindowFocus: "always",
    enabled: Boolean(tournamentId),
  });

  // 11. Seed/streak de la semana actual del portfolio — se usa para mostrar
  // el seed/multiplier real de los equipos de bye (sección de abajo).
  const currentRound = validTournament?.[0]?.current_round;
  const { data: byeWeekStatsData, isLoading: isLoadingByeWeekStats } =
    useQuery({
      queryKey: ["nflPortfolioPerWeek", portfolios, currentRound],
      queryFn: () =>
        getPortfolioPerWeek(portfolios?.[0]?.id, String(currentRound)),
      retry: 1,
      enabled: Boolean(portfolios?.[0]?.id && currentRound),
    });

  // --- Sincronización de estados ---

  useEffect(() => {
    if (tournament) setValidTournament(tournament);
  }, [tournament]);

  useEffect(() => {
    if (teamsNFL) setTeamsComplete(teamsNFL);
  }, [teamsNFL]);

  useEffect(() => {
    if (portfolios) setAllPortfolios(portfolios);
  }, [portfolios]);

  useEffect(() => {
    if (numberInputsReceived && portfolios) {
      if (portfolios[0]?.available_teams === 0) {
        setNumberInputs(0);
        return;
      }
      if (portfolios[0]?.available_teams) {
        setNumberInputs(portfolios[0].available_teams);
      } else {
        setNumberInputs(numberInputsReceived);
      }
    }
  }, [numberInputsReceived, portfolios]);

  useEffect(() => {
    if (teamsNotAvailable) setTeamsBloqued(teamsNotAvailable);
  }, [teamsNotAvailable]);

  useEffect(() => {
    if (numberInputs && typeof numberInputs === "number") {
      setSelectedTeams(Array(numberInputs).fill(""));
    }
  }, [numberInputs]);

  useEffect(() => {
    if (weekParameterData) setWeekParameter(weekParameterData);
  }, [weekParameterData]);

  useEffect(() => {
    if (availableByeTeamsData) setAvailableByeTeams(availableByeTeamsData);
  }, [availableByeTeamsData]);

  useEffect(() => {
    if (maxByeTeamsData !== undefined) {
      const parsed = Number(maxByeTeamsData);
      setMaxByeTeams(Number.isNaN(parsed) ? 0 : parsed);
    }
  }, [maxByeTeamsData]);

  // Recalcula el corte de edición cada 30s — así, si dejas la pantalla
  // abierta y cruzas el minuto de corte, se bloquea sin necesitar refrescar.
  useEffect(() => {
    if (!tournamentDateData || !tournamentHourData) return;

    const recalc = () =>
      setIsEditableTime(
        isEditableBeforeCutoff(
          tournamentDateData,
          tournamentHourData,
          EDIT_CUTOFF_MINUTES,
        ),
      );

    recalc();
    const interval = setInterval(recalc, 30 * 1000);
    return () => clearInterval(interval);
  }, [tournamentDateData, tournamentHourData]);

  // Carga equipos seleccionados desde el portfolio guardado, o inicializa vacíos.
  // Los bye teams del portfolio guardado son "extra": no ocupan cupo de
  // numberInputs, así que se reconstruye el array como
  // [...cupos de semana (tamaño numberInputs), ...bye teams extra].
  // El bye status se saca de teamsComplete (dato en vivo), no del team
  // guardado en el portfolio, porque este último puede no traer esa bandera.
  useEffect(() => {
    if (
      teamsBloqued &&
      AllPortfolios &&
      AllPortfolios[0]?.teams &&
      teamsComplete
    ) {
      const savedTeams = AllPortfolios[0].teams;
      const byeTeamIds = new Set(
        teamsComplete
          .filter((t) => t?.bye_team_next_week)
          .map((t) => t.id),
      );
      const savedWeekTeams = savedTeams.filter((t) => !byeTeamIds.has(t.id));
      const savedByeTeams = savedTeams.filter((t) => byeTeamIds.has(t.id));

      const weekSlots = Array(numberInputs).fill("");
      savedWeekTeams.forEach((team, i) => {
        if (i < numberInputs) weekSlots[i] = team;
      });

      setSelectedTeams([...weekSlots, ...savedByeTeams]);
    } else if (
      teamsBloqued &&
      AllPortfolios &&
      !AllPortfolios[0]?.teams &&
      teamsComplete
    ) {
      setSelectedTeams(Array(numberInputs).fill(""));
    }
  }, [teamsBloqued, AllPortfolios, teamsComplete, numberInputs]);

  const isLoadingData =
    isLoadingTournament ||
    isLoadingPortfolios ||
    isLoadingTeams ||
    isLoadingNumberInputs ||
    isLoadingTeamsDynamics ||
    isLoadingWeekParameter ||
    isLoadingTeamsNotAvailable ||
    isLoadingAvailableByeTeams ||
    isLoadingMaxByeTeams ||
    isLoadingByeWeekStats;

  return {
    validTournament,
    setValidTournament,
    AllPortfolios,
    teamsComplete,
    numberInputs,
    teamsBloqued,
    selectedTeams,
    setSelectedTeams,
    teamsDynamics,
    availableByeTeams,
    maxByeTeams,
    byeWeekStats: byeWeekStatsData ?? [],
    isEditableTime,
    editCutoffAt:
      tournamentDateData && tournamentHourData
        ? getEditCutoffDate(
            tournamentDateData,
            tournamentHourData,
            EDIT_CUTOFF_MINUTES,
          )
        : null,
    weekParameter,
    tournamentId,
    isLoadingData,
  };
};
