// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMemo } from "react";
import { TableBase } from "./Table";

const columns = [
  { header: "Year", accessorKey: "year" },
  { header: "Total Weight", accessorKey: "total_weight" },
  { header: "Total Points", accessorKey: "total_points" },
];

export default function TableHistoryPerfectPortfolios({ arrHistory, score }) {
  const data = useMemo(() => (Array.isArray(arrHistory) ? arrHistory : []), [arrHistory]);

  return (
    <TableBase
      data={data}
      columns={columns}
      title={score}
      maxHeight="60vh"
    />
  );
}
