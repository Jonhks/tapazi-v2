// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMemo } from "react";
import { TableBase } from "./Table";
import { TeamsNotPicked } from "@/types/index";

export default function TableHistoryTeamsNotPicked({
  arrHistory,
  score,
}: {
  arrHistory: TeamsNotPicked[];
  score: string;
}) {
  const columns = useMemo(
    () => [
      { header: "Year", accessorKey: "year" },
      { header: "Team", accessorKey: "team_name" },
      { header: "Tournament", accessorKey: "tournament_name" },
    ],
    [],
  );

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      title={score}
      maxHeight="35vh"
    />
  );
}
