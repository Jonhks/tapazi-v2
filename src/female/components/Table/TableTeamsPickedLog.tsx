import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableBase, BallSvg } from "./Table";

type TeamsPickedLogRow = {
  team_name: string;
  times_picked: number;
  percentage_portfolios: number;
  round_eliminated: number;
};

export default function TableTeamsPickedLog({
  arrHistory,
  score,
}: {
  arrHistory: TeamsPickedLogRow[];
  score: string;
}) {
  const columns = useMemo<ColumnDef<TeamsPickedLogRow>[]>(
    () => [
      {
        header: "Team",
        accessorKey: "team_name",
        cell: ({ getValue }) => {
          const name = String(getValue() ?? "");
          return (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                whiteSpace: "nowrap",
              }}
            >
              <BallSvg />
              {name}
            </span>
          );
        },
      },
      {
        header: "Times Picked",
        accessorKey: "times_picked",
      },
      {
        header: "% Portfolios",
        accessorKey: "percentage_portfolios",
        cell: ({ getValue }) => <span>{getValue() as number}%</span>,
      },
      {
        header: "Round\nEliminated",
        accessorKey: "round_eliminated",
      },
    ],
    [],
  );

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      title={score}
      // maxHeight="500px"
      stickyLastColumn
    />
  );
}
