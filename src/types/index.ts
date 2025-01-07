import { z } from "zod";

export const userSchema = z.object({
  name: z.string(),
  surname: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
  stateId: z.string(),
  code: z.string(),
});

export type User = z.infer<typeof userSchema>;
