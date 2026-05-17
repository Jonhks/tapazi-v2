import { useMemo } from "react";
import { ColumnDef, CellContext } from "@tanstack/react-table";
import { TableBase, BallSvg } from "./Table";

type TeamPickedRow = Record<string, unknown>;

export default function TableTeamsPicked({
  arrHistory,
  title,
}: {
  arrHistory: TeamPickedRow[];
  weekLabel?: string;
  title?: string;
}) {
  const columns = useMemo<ColumnDef<TeamPickedRow>[]>(
    () => [
      {
        header: "Portfolio",
        accessorKey: "portfolioName",
        cell: (info) => <span>{String(info.getValue() ?? "")}</span>,
      },
      {
        header: "Weight",
        accessorKey: "portfolioWeight",
        cell: (info) => {
          const val = parseFloat(String(info.getValue() ?? ""));
          return (
            <span>{isNaN(val) ? String(info.getValue() ?? "") : val.toFixed(2)}</span>
          );
        },
      },
      ...Array.from({ length: 8 }, (_, i): ColumnDef<TeamPickedRow> => ({
        header: `Team ${i + 1}`,
        accessorKey: `team${i + 1}Name`,
        cell: (info: CellContext<TeamPickedRow, unknown>) => {
          const name = info.getValue() as string | null;
          return name ? (
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
          ) : null;
        },
      })),
      { header: "Wins", accessorKey: "wins" },
      {
        header: "Elim\nTeams",
        accessorKey: "eliminatedTeams",
        id: "eliminatedTeams",
      },
      {
        header: "Score",
        accessorKey: "score",
        cell: (info) => {
          const val = parseFloat(String(info.getValue() ?? ""));
          return (
            <span>{isNaN(val) ? String(info.getValue() ?? "") : val.toFixed(2)}</span>
          );
        },
      },
    ],
    [],
  );

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      title={title}
      maxHeight="500px"
      stickyLastColumn
    />
  );
}
