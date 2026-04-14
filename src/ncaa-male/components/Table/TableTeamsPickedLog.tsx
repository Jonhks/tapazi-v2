// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMemo } from "react";
import { TableBase, BallSvg } from "./Table";
import { TeamsPickedLog } from "@/types/index";

export default function TableTeamsPickedLog({
  arrHistory,
  score,
}: {
  arrHistory: TeamsPickedLog[];
  score: string;
}) {
  const columns = useMemo(
    () => [
      {
        header: "Team",
        accessorKey: "team_name",
        cell: (info) => {
          const name = info.getValue();
          return name ? (
            <span style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
              <BallSvg />{name}
            </span>
          ) : null;
        },
      },
      { header: "Times picked", accessorKey: "times_picked" },
      {
        header: "% Portfolios",
        accessorKey: "percentage_portfolios",
        cell: (info) => `${info.getValue()}%`,
      },
      { header: "Round eliminated", accessorKey: "round_eliminated" },
    ],
    [],
  );

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      title={score}
      maxHeight="95vh"
    />
  );
}
