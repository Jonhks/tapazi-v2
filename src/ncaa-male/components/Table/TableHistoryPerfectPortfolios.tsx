// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMemo } from "react";
import { TableBase } from "./Table";

export default function TableHistoryPerfectPortfolios({ arrHistory, score }) {
  const columns = useMemo(
    () => [
      { header: "Year", accessorKey: "year" },
      { header: "Total weight", accessorKey: "total_weight" },
      { header: "Total points", accessorKey: "total_points" },
    ],
    [],
  );

  return (
    <TableBase data={arrHistory ?? []} columns={columns} title={score} />
  );
}
