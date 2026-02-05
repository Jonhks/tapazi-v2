// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useCallback } from "react";
import { toast } from "react-toastify";

export const usePortfolioValidation = (winnerTeamValidation) => {
  const [hasWinnerConflict, setHasWinnerConflict] = useState(false);

  const validateTeamSelection = useCallback(
    (selectedTeamIds: number[]) => {
      if (!winnerTeamValidation || winnerTeamValidation.length === 0) {
        setHasWinnerConflict(false);
        return true;
      }

      // Verificar si algún equipo seleccionado pertenece a un "winner of team" que también está seleccionado
      for (let i = 0; i < selectedTeamIds.length; i++) {
        for (let j = 0; j < selectedTeamIds.length; j++) {
          if (i !== j) {
            const winnerOfTeamId = selectedTeamIds[i];
            const teamId = selectedTeamIds[j];

            const conflictExists = winnerTeamValidation.some(
              (item) =>
                item.winnerOfTeam === winnerOfTeamId &&
                item.winnerOfTeamHasTeam.includes(teamId),
            );

            if (conflictExists) {
              setHasWinnerConflict(true);
              toast.error(
                "You cannot select a team that also belongs to the selection of a winner of team!",
              );
              return false;
            }
          }
        }
      }

      setHasWinnerConflict(false);
      return true;
    },
    [winnerTeamValidation],
  );

  return {
    hasWinnerConflict,
    validateTeamSelection,
  };
};
