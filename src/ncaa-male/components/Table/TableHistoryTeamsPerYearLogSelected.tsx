// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMemo } from "react";
import { TableBase } from "./Table";

export default function TableHistoryTeamsPerYearLogSelected({
  arrHistory,
  score,
  teamsPerYearLogSelected,
}) {
  if (typeof arrHistory === "string") return null;

  const columns = useMemo(
    () => [
      { header: "Year", accessorKey: "year" },
      { header: "Name", accessorKey: "name" },
    ],
    [],
  );

  const title = teamsPerYearLogSelected
    ? `${score} - ${teamsPerYearLogSelected}`
    : score;

  return <TableBase data={arrHistory ?? []} columns={columns} title={title} />;
}
