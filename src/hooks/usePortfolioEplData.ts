// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getTournamentsId,
  getPortfoliosEpl,
  getTeamsEpl,
  getNumberTEAMXP,
  getTeamsNotAvailable,
  getTeamsDynamics,
  getParameterWeek,
} from "@/api/epl/PortfoliosEplAPI";
// cutoff de edición — código portado de NFL, dejado comentado a pedido (no
// debe funcionar). Para activarlo: descomentar este import + los bloques
// marcados "cutoff de edición" más abajo en este archivo, en
// usePortfolioEplActions.ts y en MyPortfolioEPL.tsx.
// import { getParameter } from "@/api/shared/TournamentsAPI";
// import { isEditableBeforeCutoff, getEditCutoffDate } from "@/utils/getDaysLeft";

const WEEK_PARAM_KEY = "WEETOU";
// const TOURNAMENT_DATE_PARAM_KEY = "DATTOU";
// const TOURNAMENT_HOUR_PARAM_KEY = "HOUTOU";
// const EDIT_CUTOFF_MINUTES = 5;

export const usePortfolioEplData = (userId: string, sportId: string) => {
  const [validTournament, setValidTournament] = useState([]);
  const [AllPortfolios, setAllPortfolios] = useState([]);
  const [teamsComplete, setTeamsComplete] = useState([]);
  const [numberInputs, setNumberInputs] = useState([]);
  const [teamsBloqued, setTeamsBloqued] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [weekParameter, setWeekParameter] = useState(null);
  // const [isEditableTime, setIsEditableTime] = useState(true);

  // 1. Torneos del sport → de aquí sacamos el tournamentId dinámico
  const { data: tournament, isLoading: isLoadingTournament } = useQuery({
    queryKey: ["eplTournament", sportId],
    queryFn: () => getTournamentsId(sportId),
    refetchOnWindowFocus: "always",
    enabled: Boolean(sportId),
  });

  const tournamentId: string | null = tournament?.[0]?.id
    ? String(tournament[0].id)
    : null;

  // 2. Portfolios del participante para este torneo
  const { data: portfolios, isLoading: isLoadingPortfolios } = useQuery({
    queryKey: ["eplPortfolios", userId, tournamentId],
    queryFn: () => getPortfoliosEpl(userId, "0", tournamentId!),
    refetchOnWindowFocus: "always",
    enabled: Boolean(userId && tournamentId),
  });

  // 3. Equipos no disponibles
  const { data: teamsNotAvailable, isLoading: isLoadingTeamsNotAvailable } =
    useQuery({
      queryKey: ["eplTeamsNotAvailable", sportId, tournamentId],
      queryFn: () => getTeamsNotAvailable(sportId, tournamentId!),
      refetchInterval: 60 * 1000,
      refetchOnWindowFocus: "always",
      enabled: Boolean(sportId && tournamentId),
    });

  // 4. Todos los equipos del sport
  const { data: teamsEPL, isLoading: isLoadingTeams } = useQuery({
    queryKey: ["eplTeams", sportId],
    queryFn: () => getTeamsEpl(sportId, tournamentId!),
    refetchOnWindowFocus: "always",
    enabled: Boolean(userId && sportId && tournamentId),
  });

  // 5. Cantidad de inputs (slots de equipo) permitidos por el torneo
  const { data: numberInputsReceived, isLoading: isLoadingNumberInputs } =
    useQuery({
      queryKey: ["eplNumberInputs", tournamentId],
      queryFn: () => getNumberTEAMXP(tournamentId!),
      refetchOnWindowFocus: "always",
      enabled: Boolean(tournamentId),
    });

  // 6. Dinámicas de equipos (seeds y multiplicadores actuales)
  const { data: teamsDynamics, isLoading: isLoadingTeamsDynamics } = useQuery({
    queryKey: ["eplTeamsDynamics", userId, portfolios, weekParameter],
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
      queryKey: ["eplWeekParameter", tournamentId],
      queryFn: () => getParameterWeek(tournamentId!, WEEK_PARAM_KEY),
      refetchOnWindowFocus: "always",
      enabled: Boolean(tournamentId),
    });

  // cutoff de edición — DESACTIVADO (comentado a pedido, portado de NFL).
  // Fecha/hora de arranque del torneo (DATTOU/HOUTOU) — a partir de
  // EDIT_CUTOFF_MINUTES antes de ese momento ya no se podría editar el portfolio.
  // const { data: tournamentDateData } = useQuery({
  //   queryKey: ["eplTournamentDate", tournamentId],
  //   queryFn: () => getParameter(tournamentId!, TOURNAMENT_DATE_PARAM_KEY),
  //   refetchOnWindowFocus: "always",
  //   enabled: Boolean(tournamentId),
  // });

  // const { data: tournamentHourData } = useQuery({
  //   queryKey: ["eplTournamentHour", tournamentId],
  //   queryFn: () => getParameter(tournamentId!, TOURNAMENT_HOUR_PARAM_KEY),
  //   refetchOnWindowFocus: "always",
  //   enabled: Boolean(tournamentId),
  // });

  // --- Sincronización de estados ---

  useEffect(() => {
    if (tournament) setValidTournament(tournament);
  }, [tournament]);

  useEffect(() => {
    if (teamsEPL) setTeamsComplete(teamsEPL);
  }, [teamsEPL]);

  useEffect(() => {
    if (portfolios) setAllPortfolios(portfolios);
  }, [portfolios]);
  console.log("numberInputsReceived", numberInputsReceived);
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

  // Recalcula el corte de edición cada 30s — DESACTIVADO (comentado a pedido).
  // useEffect(() => {
  //   if (!tournamentDateData || !tournamentHourData) return;
  //
  //   const recalc = () =>
  //     setIsEditableTime(
  //       isEditableBeforeCutoff(
  //         tournamentDateData,
  //         tournamentHourData,
  //         EDIT_CUTOFF_MINUTES,
  //       ),
  //     );
  //
  //   recalc();
  //   const interval = setInterval(recalc, 30 * 1000);
  //   return () => clearInterval(interval);
  // }, [tournamentDateData, tournamentHourData]);

  // Carga equipos seleccionados desde el portfolio guardado, o inicializa vacíos
  useEffect(() => {
    if (
      teamsBloqued &&
      AllPortfolios &&
      AllPortfolios[0]?.teams &&
      teamsComplete
    ) {
      setSelectedTeams(AllPortfolios[0].teams);
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
    isLoadingTeamsNotAvailable;

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
    // isEditableTime,
    // editCutoffAt:
    //   tournamentDateData && tournamentHourData
    //     ? getEditCutoffDate(
    //         tournamentDateData,
    //         tournamentHourData,
    //         EDIT_CUTOFF_MINUTES,
    //       )
    //     : null,
    weekParameter,
    tournamentId,
    isLoadingData,
  };
};
