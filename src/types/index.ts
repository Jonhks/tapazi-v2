import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  surname: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
  stateId: z.string(),
  code: z.string(),
});

export const stateSchema = z.object({
  description: z.string(),
  id: z.number(),
  key: z.string(),
  name: z.string(),
});
export type UserLogin = Pick<User, "email" | "password">;
export type UserForgot = Pick<User, "email">;
export const statesSchema = z.array(stateSchema);

export type User = z.infer<typeof userSchema>;
export type States = z.infer<typeof statesSchema>;
export type State = z.infer<typeof stateSchema>;

// ? Table

export const otherSchema = z.object({
  portfolioName: z.string(),
  portfolioWeight: z.string(),
  team1Name: z.string(),
  team2Name: z.string(),
  team3Name: z.string(),
  team4Name: z.string(),
  team5Name: z.string(),
  team6Name: z.string(),
  team7Name: z.string(),
  team8Name: z.string(),
  score: z.number(),
  championshipPoints: z.number(),
  paid: z.boolean(),
});

export const participantSchema = z.object({});

export const scoresSchema = z.object({
  other: z.array(otherSchema),
  participant: z.array(participantSchema),
});

export type ScoresOthers = z.infer<typeof scoresSchema>;
export type OtherScores = z.infer<typeof otherSchema>;
export type ParticipantsScores = z.infer<typeof participantSchema>;

export const PayOutSchema = z.object({
  place: z.number(),
  percentage: z.number(),
});

export const teamSchema = z.object({
  description: z.string(),
  id: z.number(),
  key: z.string(),
  name: z.string(),
  play_in_team: z.boolean(),
  seed: z.number(),
});

export type Team = z.infer<typeof teamSchema>;

export type PayOut = z.infer<typeof PayOutSchema>;

export const portfolioSchema = z.object({
  championshipPoints: z.number(),
  newPortfolio: z.boolean(),
  teams: z.union([z.array(teamSchema), z.array(z.boolean())]),
  name: z.string().optional(),
  id: z.number().optional(),
});

export const portfolioCompleteSchema = z.object({
  championshipPoints: z.number(),
  newPortfolio: z.boolean(),
  teams: z.union([z.array(teamSchema), z.array(z.boolean())]),
  name: z.string(),
  id: z.number(),
});

export type Portfolios = z.infer<typeof portfoliosSchema>;
export type NewPortfolio = z.infer<typeof portfolioSchema>;
export type PortfolioComplete = z.infer<typeof portfolioCompleteSchema>;

export const createPortfolioSchema = z.object({
  championshipPoints: z.number(),
  teamsId: z.array(
    z.object({
      id: z.number(),
    })
  ),
});

export const portfoliosSchema = z.array(portfolioSchema);
export type CreatePortfolio = z.infer<typeof createPortfolioSchema>;

// Tournaments

export const tournamentSchema = z.object({
  current: z.boolean(),
  description: z.string(),
  id: z.number(),
  key: z.string(),
  name: z.string(),
});

export const tournamentsSchema = z.array(tournamentSchema);

export type Tournament = z.infer<typeof tournamentSchema>;
export type Tournaments = z.infer<typeof tournamentsSchema>;

// teamsPerYearLog

export const teamPerYearLogSchema = z.object({
  year: z.number(),
  teams: z.number(),
  tournament_id: z.number(),
});

export const teamsPerYearLogSchema = z.array(teamPerYearLogSchema);
export type TeamPerYearLog = z.infer<typeof teamPerYearLogSchema>;
export type TeamsPerYearLog = z.infer<typeof teamsPerYearLogSchema>;

export const teamPerfectPortfoliosSchema = z.object({
  year: z.number(),
  tournament_id: z.number(),
  total_weight: z.number(),
  total_points: z.number(),
  tournament_name: z.string(),
});

export type TeamPerfectPortfolios = z.infer<typeof teamPerfectPortfoliosSchema>;

export const mostPickedTeamsSchema = z.object({
  percentage_portfolios: z.number(),
  team_name: z.string(),
  times_picked: z.number(),
  tournament_name: z.string(),
  year: z.number(),
});

export const MostsPickedTeams = z.array(mostPickedTeamsSchema);
export type MostPickedTeams = z.infer<typeof mostPickedTeamsSchema>;

export const teamsPickedLogSchema = z.object({
  year: z.number(),
  tournament_name: z.string(),
  times_picked: z.number(),
  team_name: z.string(),
  round_eliminated: z.number(),
  percentage_portfolios: z.number(),
});

export type TeamsPickedLog = z.infer<typeof teamsPickedLogSchema>;

export const teamsNotPickedSchema = z.object({
  team_name: z.string(),
  tournament_name: z.string(),
  year: z.number(),
});

export type TeamsNotPicked = z.infer<typeof teamsNotPickedSchema>;

export const instructionsSchema = z.object({
  description: z.string(),
  name: z.string(),
  highlighted: z.boolean(),
});

export type Instructions = z.infer<typeof instructionsSchema>;
