import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableBase, BallSvg } from "./Table";

type TeamsNotPickedRow = {
  year: number;
  team_name: string;
  tournament_name: string;
};

export default function TableHistoryTeamsNotPicked({
  arrHistory,
  score,
}: {
  arrHistory: TeamsNotPickedRow[];
  score: string;
}) {
  const columns = useMemo<ColumnDef<TeamsNotPickedRow>[]>(
    () => [
      {
        header: "Year",
        accessorKey: "year",
      },
      {
        header: "Team",
        accessorKey: "team_name",
        cell: ({ getValue }) => {
          const name = String(getValue() ?? "");
          return (
            <span style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
              <BallSvg />
              {name}
            </span>
          );
        },
      },
      {
        header: "Tournament",
        accessorKey: "tournament_name",
      },
    ],
    [],
  );

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      title={score}
      maxHeight="400px"
      stickyLastColumn
    />
  );
}
