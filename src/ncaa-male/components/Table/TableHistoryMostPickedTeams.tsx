// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMemo } from "react";
import { TableBase } from "./Table";
import { MostPickedTeams } from "@/types/index";

export default function TableHistoryMostPickedTeams({
  arrHistory,
  score,
  least,
}: {
  arrHistory: MostPickedTeams[];
  score: string;
  least?: boolean;
}) {
  const columns = useMemo(
    () => [
      ...(!least
        ? [{ header: "Tournament", accessorKey: "tournament_name" }]
        : []),
      { header: "Team name", accessorKey: "team_name" },
      { header: "Times picked", accessorKey: "times_picked" },
      {
        header: "% Portfolios",
        accessorKey: "percentage_portfolios",
        cell: (info) => `${info.getValue()}%`,
      },
    ],
    [least],
  );

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      title={score}
      maxHeight="40vh"
    />
  );
}
