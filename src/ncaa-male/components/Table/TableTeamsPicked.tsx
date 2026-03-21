// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMemo } from "react";
import { TableBase } from "./Table";

export default function TableTeamsPicked({
  arrHistory,
  weekLabel,
}: {
  arrHistory: any[];
  weekLabel?: string;
}) {
  const columns = useMemo(
    () => [
      {
        header: "Portfolio",
        accessorKey: "portfolioName",
        cell: (info) => (
          <span style={{ color: "#05fa87" }}>{info.getValue()}</span>
        ),
      },
      {
        header: "Weight",
        accessorKey: "portfolioWeight",
        cell: (info) => {
          const val = parseFloat(info.getValue());
          return <span>{isNaN(val) ? info.getValue() : val.toFixed(2)}</span>;
        },
      },
      ...Array.from({ length: 8 }, (_, i) => ({
        header: `Team ${i + 1}`,
        accessorKey: `team${i + 1}Name`,
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
          const val = parseFloat(info.getValue());
          return <span>{isNaN(val) ? info.getValue() : val.toFixed(2)}</span>;
        },
      },
    ],
    [],
  );

  const title = weekLabel ? `Teams Picked - ${weekLabel}` : "Teams Picked";

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      title={title}
      stickyLastColumn
    />
  );
}
