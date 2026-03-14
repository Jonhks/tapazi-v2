import { apiGet } from "@/lib/apiClient";
import { Instructions } from "@/types/index";

export const getInstructionsEpl = (id: string): Promise<Instructions[]> =>
  apiGet<{ instructions: Instructions[] }>(`/tournaments/${id}/instructions`).then(
    (d) => d.instructions ?? [],
  );
