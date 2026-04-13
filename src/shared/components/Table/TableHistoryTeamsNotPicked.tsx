import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableBase } from "./TableBase";
import { BallSvg } from "./BallSvg";
import { SportTheme } from "@/shared/theme/colors";
import { TeamsNotPicked } from "@/types/index";

interface Props {
  arrHistory: TeamsNotPicked[];
  score: string;
  theme: SportTheme;
}

export default function TableHistoryTeamsNotPicked({ arrHistory, score, theme }: Props) {
  const columns = useMemo<ColumnDef<TeamsNotPicked>[]>(
    () => [
      { header: "Year", accessorKey: "year" },
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
      { header: "Tournament", accessorKey: "tournament_name" },
    ],
    [],
  );

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      theme={theme}
      title={score}
      maxHeight="35vh"
    />
  );
}
