import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableBase } from "./TableBase";
import { BallSvg } from "./BallSvg";
import { SportTheme } from "@/shared/theme/colors";
import { MostPickedTeams } from "@/types/index";

interface Props {
  arrHistory: MostPickedTeams[];
  score: string;
  least?: boolean;
  theme: SportTheme;
}

export default function TableHistoryMostPickedTeams({
  arrHistory,
  score,
  least,
  theme,
}: Props) {
  const columns = useMemo<ColumnDef<MostPickedTeams>[]>(
    () => [
      ...(!least
        ? [{ header: "Tournament", accessorKey: "tournament_name" } as ColumnDef<MostPickedTeams>]
        : []),
      {
        header: "Team name",
        accessorKey: "team_name",
        cell: (info) => {
          const name = info.getValue() as string;
          return name ? (
            <span style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
              <BallSvg />
              {name}
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
    ],
    [least],
  );

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      theme={theme}
      title={score}
      maxHeight="40vh"
    />
  );
}
