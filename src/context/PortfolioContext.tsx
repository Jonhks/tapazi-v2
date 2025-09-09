import { createContext, useContext } from "react";
import { NumberInputs, Team } from "../types";

export type PortfolioContextType = {
  teamsComplete: Team[];
  setTeamsComplete: React.Dispatch<React.SetStateAction<Team[]>>;
  numberInputs: string[] | NumberInputs;
  setNumberInputs: React.Dispatch<
    React.SetStateAction<string[] | NumberInputs>
  >;
  selectedTeams: Team[];
  setSelectedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
};

export const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined
);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
