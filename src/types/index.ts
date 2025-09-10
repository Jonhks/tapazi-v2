import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  surname: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
  state_id: z.string(),
  country_id: z.string(),
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

export const numberInputsSchema = z.object({
  crest_url: z.string().url().optional(),
  current_seed: z.number(),
  current_streak: z.number(),
  description: z.string(),
  id: z.number(),
  key: z.string(),
  name: z.string(),
  seed: z.number(),
  selected: z.boolean().optional(),
  streak_multiplier: z.number(),
  streak_seed: z.string(),
});

export type Team = z.infer<typeof teamSchema>;
export type NumberInputs = z.infer<typeof numberInputsSchema>;

export type PayOut = z.infer<typeof PayOutSchema>;

export const portfolioSchema = z.object({
  championshipPoints: z.number(),
  newPortfolio: z.boolean(),
  teams: z.union([z.array(teamSchema), z.array(z.boolean())]),
  name: z.string().optional(),
  id: z.number().optional(),
  crest_url: z.string().url().optional(),
  available: z.boolean().optional(),
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
  teams: z
    .array(
      z.object({
        id: z.number(),
      })
    )
    .optional(),
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
  crest_url: z.string().url(),
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

export const sportSchema = z.object({
  description: z.string(),
  id: z.number(),
  key: z.string(),
  url: z.string().url(),
  name: z.string(),
  url_disabled: z.string(),
});

export type Sport = z.infer<typeof sportSchema>;

export const scoresEplSchema = z.object({
  name: z.string(),
  portfolio_id: z.number(),
  score_week1: z.number().nullable(),
  score_week2: z.number().nullable(),
  score_week3: z.number().nullable(),
  score_week4: z.number().nullable(),
  score_week5: z.number().nullable(),
  score_week6: z.number().nullable(),
  score_week7: z.number().nullable(),
  score_week8: z.number().nullable(),
  score_week9: z.number().nullable(),
  score_week10: z.number().nullable(),
  score_week11: z.number().nullable(),
  score_week12: z.number().nullable(),
  score_week13: z.number().nullable(),
  score_week14: z.number().nullable(),
  score_week15: z.number().nullable(),
  score_week16: z.number().nullable(),
  score_week17: z.number().nullable(),
  score_week18: z.number().nullable(),
  score_week19: z.number().nullable(),
  score_week20: z.number().nullable(),
  score_week21: z.number().nullable(),
  score_week22: z.number().nullable(),
  score_week23: z.number().nullable(),
  score_week24: z.number().nullable(),
  score_week25: z.number().nullable(),
  score_week26: z.number().nullable(),
  score_week27: z.number().nullable(),
  score_week28: z.number().nullable(),
  score_week29: z.number().nullable(),
  score_week30: z.number().nullable(),
  score_week31: z.number().nullable(),
  score_week32: z.number().nullable(),
  score_week33: z.number().nullable(),
  score_week34: z.number().nullable(),
  score_week35: z.number().nullable(),
  score_week36: z.number().nullable(),
  score_week37: z.number().nullable(),
  score_week38: z.number().nullable(),
  score: z.number(),
});
export type ScoresEplHome = z.infer<typeof scoresEplSchema>;
