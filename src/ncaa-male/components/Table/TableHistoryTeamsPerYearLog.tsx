// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMemo } from "react";
import { TableBase } from "./Table";

export default function TableHistoryTeamsPerYearLog({ arrHistory, score }) {
  const columns = useMemo(
    () => [
      { header: "Year", accessorKey: "year" },
      { header: "Team", accessorKey: "teams" },
    ],
    [],
  );

  return <TableBase data={arrHistory ?? []} columns={columns} title={score} />;
}
