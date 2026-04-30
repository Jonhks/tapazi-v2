import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableBase } from "./TableBase";
import { BallSvg } from "./BallSvg";
import { SportTheme } from "@/shared/theme/colors";
import { TeamsPickedLog } from "@/types/index";

interface Props {
  arrHistory: TeamsPickedLog[];
  score: string;
  theme: SportTheme;
}

export default function TableTeamsPickedLog({ arrHistory, score, theme }: Props) {
  const columns = useMemo<ColumnDef<TeamsPickedLog>[]>(
    () => [
      {
        header: "Team",
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
      { header: "Round eliminated", accessorKey: "round_eliminated" },
    ],
    [],
  );

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      theme={theme}
      title={score}
      maxHeight="95vh"
    />
  );
}
