// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMemo } from "react";
import { TableBase } from "./Table";

export default function TableHistoryPerfectPortfoliosSelected({
  arrHistory,
  score,
  TeamPerfectPortfoliosSelected,
}) {
  if (typeof arrHistory === "string") return null;

  const columns = useMemo(
    () => [
      { header: "Name", accessorKey: "name" },
      { header: "Points", accessorKey: "points" },
    ],
    [],
  );

  const title = TeamPerfectPortfoliosSelected
    ? `${score} Year: ${TeamPerfectPortfoliosSelected}`
    : score;

  return <TableBase data={arrHistory ?? []} columns={columns} title={title} />;
}
