import { apiGet } from "@/lib/apiClient";
import { Instructions } from "@/types/index";

export const getInstructionsFemale = (): Promise<Instructions[]> =>
  apiGet<{ instructions: Instructions[] }>(`tournaments/5/instructions`).then(
    (d) => d.instructions ?? [],
  );
