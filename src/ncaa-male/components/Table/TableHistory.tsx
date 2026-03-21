// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMemo, useState, useEffect } from "react";
import { TableBase } from "./Table";

export default function TableHistory({ arrHistory, score }) {
  const [showEliminatedTeams, setShowEliminatedTeams] = useState(false);

  useEffect(() => {
    const found = arrHistory?.some((el) => el?.eliminatedTeams);
    setShowEliminatedTeams(!!found);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrHistory]);

  const columns = useMemo(
    () => [
      { header: "Portfolio Name", accessorKey: "portfolioName" },
      { header: "Portfolio Weight", accessorKey: "portfolioWeight" },
      ...Array.from({ length: 8 }, (_, i) => ({
        header: `Team ${i + 1}`,
        accessorKey: `team${i + 1}Name`,
      })),
      { header: "Wins", accessorKey: "wins" },
      { header: "Score", accessorKey: "score" },
      showEliminatedTeams
        ? { header: "Eliminated Teams", accessorKey: "eliminatedTeams" }
        : { header: "Champ. Points", accessorKey: "championshipPoints" },
    ],
    [showEliminatedTeams],
  );

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      title={score}
      maxHeight="50vh"
      stickyLastColumn
    />
  );
}
