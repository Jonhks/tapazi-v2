import React, { useEffect, useState } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { PortfolioContextType } from "../context/PortfolioContext";
import { NumberInputs, Team, Tournament } from "../types";
import {
  getTournamentsId,
  getPortfoliosEpl,
  getTeamsEpl,
  getNumberInputs,
  getTeamsNotAvailable,
} from "@/api/epl/PortfoliosEplAPI";
import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";

export const PortfolioProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userId, setUserId] = useState<string | null>(null);

  const [validTournament, setValidTournament] = useState<Tournament[]>([]); //estado de getTournamentsId
  const [AllPortfolios, setAllPortfolios] = useState<Tournament[]>([]); //estado de getPortfoliosEpl
  const [teamsComplete, setTeamsComplete] = useState<Team[]>([]); // estado de getTeamsEpl
  const [numberInputs, setNumberInputs] = useState<string[] | NumberInputs>([]); // estado de getNumberInputs
  const [teamsBloqued, setTeamsBloqued] = useState<Team[]>([]); //estado de equipos no teamsNotAvailable

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

  const { data: teamsEPL, isLoading } = useQuery({
    queryKey: ["teamsEpl", userId],
    queryFn: () => getTeamsEpl("2"),
    refetchOnWindowFocus: "always",
    enabled: Boolean(userId),
  });

  const { data: numberInputsRecived, isLoading: isLoadingNumberInputs } =
    useQuery({
      queryKey: ["numberInputsRecived", userId, location.pathname],
      queryFn: () => getNumberInputs(),
      refetchOnWindowFocus: "always",
    });

  const { data: teamsNotAvailable, isLoading: isLoadingTeamsNotAvailable } =
    useQuery({
      queryKey: ["teamsNotAvailable", userId],
      queryFn: () => getTeamsNotAvailable("2", "3"),
      refetchInterval: 60 * 1000,
      refetchOnWindowFocus: "always",
    });

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
    if (numberInputsRecived) {
      setNumberInputs(numberInputsRecived);
    }
  }, [numberInputsRecived]);

  useEffect(() => {
    if (teamsNotAvailable) {
      setTeamsBloqued(teamsNotAvailable);
    }
  }, [teamsNotAvailable]);

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
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
