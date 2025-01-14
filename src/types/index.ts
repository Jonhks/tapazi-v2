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

export type PayOut = z.infer<typeof PayOutSchema>;
