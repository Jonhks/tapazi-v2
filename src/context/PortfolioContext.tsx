import { createContext, useContext } from "react";
import { NewPortfolio, NumberInputs, Team, Tournament } from "../types";

export type PortfolioContextType = {
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  validTournament: Tournament[];
  setValidTournament: React.Dispatch<React.SetStateAction<Tournament[]>>;
  AllPortfolios: NewPortfolio[];
  setAllPortfolios: React.Dispatch<React.SetStateAction<NewPortfolio[]>>;
  teamsComplete: Team[];
  setTeamsComplete: React.Dispatch<React.SetStateAction<Team[]>>;
  numberInputs: string[] | NumberInputs;
  setNumberInputs: React.Dispatch<
    React.SetStateAction<string[] | NumberInputs>
  >;
  selectedTeams: Team[];
  setSelectedTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  teamsBloqued: Team[];
  setTeamsBloqued: React.Dispatch<React.SetStateAction<Team[]>>;
  isLoadingData: boolean;
  rendersAmountOfInputs: string[];
  setRendersAmountOfInputs: React.Dispatch<React.SetStateAction<string[]>>;
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
