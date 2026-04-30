import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableBase } from "./TableBase";
import { SportTheme } from "@/shared/theme/colors";

interface TeamsPerYearEntry {
  year: string | number;
  teams: string;
}

interface Props {
  arrHistory: TeamsPerYearEntry[];
  score: string;
  theme: SportTheme;
}

export default function TableHistoryTeamsPerYearLog({
  arrHistory,
  score,
  theme,
}: Props) {
  const columns = useMemo<ColumnDef<TeamsPerYearEntry>[]>(
    () => [
      { header: "Year", accessorKey: "year" },
      { header: "Team", accessorKey: "teams" },
    ],
    [],
  );

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      theme={theme}
      title={score}
    />
  );
}
