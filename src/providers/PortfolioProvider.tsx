// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { PortfolioContext } from "../context/PortfolioContext";
import { PortfolioContextType } from "../context/PortfolioContext";
import { NumberInputs, Team, TeamsNotPicked, Tournament } from "../types";
import {
  getTournamentsId,
  getPortfoliosEpl,
  getTeamsEpl,
  getNumberTEAMXP,
  getTeamsNotAvailable,
  getTeamsDynamics,
  getParameterWeek,
} from "@/api/epl/PortfoliosEplAPI";
import { useQuery } from "@tanstack/react-query";

export const PortfolioProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const location = useLocation();
  const isEplRoute = location.pathname.startsWith("/epl");

  const [validTournament, setValidTournament] = useState<Tournament[]>([]); //estado de getTournamentsId
  const [AllPortfolios, setAllPortfolios] = useState<TeamsNotPicked[]>([]); //estado de getPortfoliosEpl
  const [teamsComplete, setTeamsComplete] = useState<Team[]>([]); // estado de getTeamsEpl
  const [numberInputs, setNumberInputs] = useState<string[] | NumberInputs>([]); // estado de getNumberTEAMXP
  const [teamsBloqued, setTeamsBloqued] = useState<Team[]>([]); //estado de equipos no teamsNotAvailable
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]); //estado de los equipos seleccionados
  const [weekParameter, setWeekParameter] = useState<number>(null); //estado de la semana seleccionada

  const [rendersAmountOfInputs, setRendersAmountOfInputs] = useState<string[]>(
    []
  );

  const { data: tournament, isLoading: isLoadingTournament } = useQuery({
    queryKey: ["tournament", userId],
    queryFn: () => getTournamentsId(),
    refetchOnWindowFocus: "always",
    enabled: Boolean(userId) && isEplRoute,
  });

  const { data: portfolios, isLoading: isLoadingPortfolios } = useQuery({
    queryKey: ["portfolios", userId],
    queryFn: () => getPortfoliosEpl(userId!, "0"),
    refetchOnWindowFocus: "always",
    enabled: Boolean(userId) && isEplRoute,
  });

  const { data: teamsNotAvailable, isLoading: isLoadingTeamsNotAvailable } =
    useQuery({
      queryKey: ["teamsNotAvailable", userId],
      queryFn: () => getTeamsNotAvailable("2", "3"),
      refetchInterval: 60 * 1000,
      refetchOnWindowFocus: "always",
      enabled: isEplRoute,
    });

  const { data: teamsEPL, isLoading } = useQuery({
    queryKey: ["teamsEpl", userId],
    queryFn: () => getTeamsEpl("2"),
    refetchOnWindowFocus: "always",
    enabled: Boolean(userId) && isEplRoute,
  });

  const { data: numberInputsRecived, isLoading: isLoadingNumberInputs } =
    useQuery({
      queryKey: ["numberInputsRecived", userId, location.pathname],
      queryFn: () => getNumberTEAMXP(),
      refetchOnWindowFocus: "always",
      enabled: isEplRoute,
    });

  const { data: teamsDynamics, isLoading: isLoadingTeamsDynamics } = useQuery({
    queryKey: ["teamsDynamics", userId, portfolios, weekParameter],
    queryFn: () => getTeamsDynamics(2, portfolios?.[0]?.id || "0"),
    refetchOnWindowFocus: "always",
    retry: 1,
    enabled: Boolean(
      userId &&
        portfolios?.length > 0 &&
        validTournament &&
        validTournament[0]?.current_round !== weekParameter
    ),
  });

  const { data: getWeekParameter, isLoading: isLoadingWeekParameter } =
    useQuery({
      queryKey: ["weekParameter", userId, portfolios],
      queryFn: () => getParameterWeek("3", "WEETOU"),
      refetchOnWindowFocus: "always",
      enabled: isEplRoute,
      // retry: 1,
      // enabled: Boolean(userId && portfolios?.length > 0),
    });

  // console.log(weekParameter, "weekParameter");

  // Actualiza los estados locales cuando las consultas cambien
  useEffect(() => {
    if (tournament) {
      setValidTournament(tournament);
    }
  }, [tournament]);

  useEffect(() => {
    if (teamsEPL) {
      setTeamsComplete(teamsEPL);
    }
  }, [teamsEPL]);

  useEffect(() => {
    if (portfolios) {
      setAllPortfolios(portfolios);
    }
  }, [portfolios]);

  useEffect(() => {
    if (numberInputsRecived && portfolios) {
      if (portfolios[0].available_teams === 0) {
        setNumberInputs(0);
        return;
      }
      if (portfolios[0]?.available_teams) {
        setNumberInputs(portfolios[0]?.available_teams);
      } else {
        setNumberInputs(numberInputsRecived);
      }
    }
  }, [numberInputsRecived, portfolios]);

  // console.log(portfolios);
  // console.log(numberInputsRecived, "numberInputsRecived");

  useEffect(() => {
    if (teamsNotAvailable) {
      setTeamsBloqued(teamsNotAvailable);
    }
  }, [teamsNotAvailable]);

  useEffect(() => {
    if (numberInputs) {
      if (typeof numberInputs === "number") {
        setSelectedTeams(Array(numberInputs).fill(""));
      }
    }
  }, [numberInputs]);

  useEffect(() => {
    if (getWeekParameter) {
      setWeekParameter(getWeekParameter);
    }
  }, [getWeekParameter]);

  useEffect(() => {
    // if (teamsBloqued && AllPortfolios && teamsComplete) {
    //   setSelectedTeams(AllPortfolios[0]?.teams);
    // }
    // if (
    //   (teamsBloqued.length === 0 || AllPortfolios.length === 0) &&
    //   teamsComplete
    // ) {
    //   setSelectedTeams(Array(numberInputs).fill(""));
    // }
    if (
      teamsBloqued &&
      AllPortfolios &&
      AllPortfolios[0]?.teams &&
      teamsComplete
    ) {
      setSelectedTeams(AllPortfolios[0]?.teams);
    } else if (
      teamsBloqued &&
      AllPortfolios &&
      !AllPortfolios[0]?.teams &&
      teamsComplete
    ) {
      setSelectedTeams(Array(numberInputs).fill(""));
    }
  }, [teamsBloqued, AllPortfolios, teamsComplete, numberInputs]);

  // console.log(teamsBloqued); // []
  // console.log(AllPortfolios); // Portfolio[0].teams || !Portfolio[0].teams
  // console.log(teamsComplete); // all teams

  // console.log(selectedTeams);  // Equipos seleccionados

  const isLoadingData =
    isLoadingTournament ||
    isLoadingPortfolios ||
    isLoading ||
    isLoadingNumberInputs ||
    isLoadingTeamsDynamics ||
    isLoadingWeekParameter ||
    isLoadingTeamsNotAvailable;

  const value: PortfolioContextType = {
    userId,
    setUserId,
    validTournament,
    setValidTournament,
    AllPortfolios,
    setAllPortfolios,
    teamsComplete,
    setTeamsComplete,
    numberInputs,
    setNumberInputs,
    teamsBloqued,
    setTeamsBloqued,
    isLoadingData,
    rendersAmountOfInputs,
    setRendersAmountOfInputs,
    selectedTeams,
    setSelectedTeams,
    teamsDynamics,
    weekParameter,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
