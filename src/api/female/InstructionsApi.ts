import { apiGet } from "@/lib/apiClient";

export const getInstructionsFemale = () =>
  apiGet<{ instructions: unknown[] }>(`tournaments/5/instructions`).then(
    (d) => d.instructions ?? [],
  );
