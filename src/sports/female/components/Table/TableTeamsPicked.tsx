import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableBase, BallSvg } from "./Table";

type TeamsPickedRow = {
  portfolioName: string;
  portfolioWeight: string | number;
  team1Name?: string;
  team2Name?: string;
  team3Name?: string;
  team4Name?: string;
  team5Name?: string;
  team6Name?: string;
  team7Name?: string;
  team8Name?: string;
  wins: number;
  score: string | number;
};

const MAGENTA = "#e040fb";

export default function TableTeamsPicked({
  arrHistory,
  title,
}: {
  arrHistory: TeamsPickedRow[];
  title?: string;
}) {
  const columns = useMemo<ColumnDef<TeamsPickedRow>[]>(
    () => [
      {
        header: "Portfolio",
        accessorKey: "portfolioName",
        cell: ({ getValue }) => (
          <span style={{ color: MAGENTA, fontWeight: 600, letterSpacing: "0.5px" }}>
            {String(getValue() ?? "")}
          </span>
        ),
      },
      {
        header: "Weight",
        accessorKey: "portfolioWeight",
        cell: ({ getValue }) => {
          const val = parseFloat(String(getValue()));
          return <span>{isNaN(val) ? String(getValue()) : val.toFixed(3)}</span>;
        },
      },
      ...Array.from({ length: 8 }, (_, i): ColumnDef<TeamsPickedRow> => ({
        header: `Team ${i + 1}`,
        accessorKey: `team${i + 1}Name`,
        cell: ({ getValue }) => {
          const name = getValue() as string | undefined;
          return name ? (
            <span style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
              <BallSvg />
              {name}
            </span>
          ) : null;
        },
      })),
      {
        header: "Wins",
        accessorKey: "wins",
      },
      {
        header: "Score",
        accessorKey: "score",
        cell: ({ getValue }) => {
          const val = parseFloat(String(getValue()));
          return <span>{isNaN(val) ? String(getValue()) : val.toFixed(2)}</span>;
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
