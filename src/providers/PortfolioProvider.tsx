// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unsafe-optional-chaining */
import React, { useEffect, useState } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { PortfolioContextType } from "../context/PortfolioContext";
import { NumberInputs, Team, TeamsNotPicked, Tournament } from "../types";
import {
  getTournamentsId,
  getPortfoliosEpl,
  getTeamsEpl,
  getNumberTEAMXP,
  getTeamsNotAvailable,
} from "@/api/epl/PortfoliosEplAPI";
import { useQuery } from "@tanstack/react-query";

export const PortfolioProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userId, setUserId] = useState<string | null>(null);

  const [validTournament, setValidTournament] = useState<Tournament[]>([]); //estado de getTournamentsId
  const [AllPortfolios, setAllPortfolios] = useState<TeamsNotPicked[]>([]); //estado de getPortfoliosEpl
  const [teamsComplete, setTeamsComplete] = useState<Team[]>([]); // estado de getTeamsEpl
  const [numberInputs, setNumberInputs] = useState<string[] | NumberInputs>([]); // estado de getNumberTEAMXP
  const [teamsBloqued, setTeamsBloqued] = useState<Team[]>([]); //estado de equipos no teamsNotAvailable
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]); //estado de los equipos seleccionados

  const [rendersAmountOfInputs, setRendersAmountOfInputs] = useState<string[]>(
    []
  );

  const { data: tournament, isLoading: isLoadingTournament } = useQuery({
    queryKey: ["tournament", userId],
    queryFn: () => getTournamentsId(),
    refetchOnWindowFocus: "always",
    enabled: Boolean(userId),
  });

  const { data: portfolios, isLoading: isLoadingPortfolios } = useQuery({
    queryKey: ["portfolios", userId],
    queryFn: () => getPortfoliosEpl(userId!, "0"),
    refetchOnWindowFocus: "always",
    enabled: Boolean(userId),
  });

  const { data: teamsNotAvailable, isLoading: isLoadingTeamsNotAvailable } =
    useQuery({
      queryKey: ["teamsNotAvailable", userId],
      queryFn: () => getTeamsNotAvailable("2", "3"),
      refetchInterval: 60 * 1000,
      refetchOnWindowFocus: "always",
    });

  const { data: teamsEPL, isLoading } = useQuery({
    queryKey: ["teamsEpl", userId],
    queryFn: () => getTeamsEpl("2"),
    refetchOnWindowFocus: "always",
    enabled: Boolean(userId),
  });

  const { data: numberInputsRecived, isLoading: isLoadingNumberInputs } =
    useQuery({
      queryKey: ["numberInputsRecived", userId, location.pathname],
      queryFn: () => getNumberTEAMXP(),
      refetchOnWindowFocus: "always",
    });

  console.log(portfolios);

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
      if (portfolios[0]?.available_teams) {
        setNumberInputs(portfolios[0]?.available_teams);
      } else {
        setNumberInputs(numberInputsRecived);
      }
    }
  }, [numberInputsRecived, portfolios]);

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
    if (teamsBloqued && AllPortfolios && teamsComplete) {
      setSelectedTeams(AllPortfolios[0]?.teams);
    }
  }, [teamsBloqued, AllPortfolios, teamsComplete, numberInputs]);

  const isLoadingData =
    isLoadingTournament ||
    isLoadingPortfolios ||
    isLoading ||
    isLoadingNumberInputs ||
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
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
