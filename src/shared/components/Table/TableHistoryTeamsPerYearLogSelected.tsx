import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableBase } from "./TableBase";
import { SportTheme } from "@/shared/theme/colors";

interface TeamsPerYearSelectedEntry {
  year: string | number;
  name: string;
}

interface Props {
  arrHistory: TeamsPerYearSelectedEntry[] | string;
  score: string;
  teamsPerYearLogSelected?: string | number;
  theme: SportTheme;
}

export default function TableHistoryTeamsPerYearLogSelected({
  arrHistory,
  score,
  teamsPerYearLogSelected,
  theme,
}: Props) {
  if (typeof arrHistory === "string") return null;

  const columns = useMemo<ColumnDef<TeamsPerYearSelectedEntry>[]>(
    () => [
      { header: "Year", accessorKey: "year" },
      { header: "Name", accessorKey: "name" },
    ],
    [],
  );

  const title = teamsPerYearLogSelected
    ? `${score} - ${teamsPerYearLogSelected}`
    : score;

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      theme={theme}
      title={title}
    />
  );
}
