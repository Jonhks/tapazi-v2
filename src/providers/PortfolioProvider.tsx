import React, { useState } from "react";
import { PortfolioContext } from "../context/PortfolioContext";
import { PortfolioContextType } from "../context/PortfolioContext";
import { NumberInputs, Team } from "../types";

export const PortfolioProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [teamsComplete, setTeamsComplete] = useState<Team[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const [numberInputs, setNumberInputs] = useState<string[] | NumberInputs>([]);

  const value: PortfolioContextType = {
    teamsComplete,
    setTeamsComplete,
    numberInputs,
    setNumberInputs,
    selectedTeams,
    setSelectedTeams,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
