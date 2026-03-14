import { apiGet } from "@/lib/apiClient";
import { User } from "../../types";

export const getInstructionsEpl = (id: User["id"]) =>
  apiGet<{ instructions: unknown[] }>(`/tournaments/${id}/instructions`).then(
    (d) => d.instructions ?? [],
  );
