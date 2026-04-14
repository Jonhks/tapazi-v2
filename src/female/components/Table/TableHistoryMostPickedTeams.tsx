import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableBase, BallSvg } from "./Table";

const MAGENTA = "#e040fb";

type MostPickedRow = {
  year: number;
  tournament_name: string;
  team_name: string;
  times_picked: number;
  percentage_portfolios: number;
};

export default function TableHistoryMostPickedTeams({
  arrHistory,
  score,
  least,
}: {
  arrHistory: MostPickedRow[];
  score: string;
  least?: boolean;
}) {
  const columns = useMemo<ColumnDef<MostPickedRow>[]>(
    () => [
      ...(!least
        ? [
            {
              header: "Tournament",
              accessorKey: "tournament_name",
              cell: ({ getValue }: { getValue: () => unknown }) => (
                <span style={{ color: MAGENTA, fontWeight: 600, letterSpacing: "0.5px" }}>
                  {String(getValue() ?? "")}
                </span>
              ),
            } as ColumnDef<MostPickedRow>,
          ]
        : []),
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
        header: "Times Picked",
        accessorKey: "times_picked",
      },
      {
        header: "% Portfolios",
        accessorKey: "percentage_portfolios",
        cell: ({ getValue }) => <span>{getValue() as number}%</span>,
      },
    ],
    [least],
  );

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      title={score}
      maxHeight="500px"
      stickyLastColumn
    />
  );
}
