// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMemo, memo } from "react";
import { TableBase } from "./Table";

const EXCLUDED_KEYS = [
  "tournament_name",
  "consecutive",
  "round5_place",
  "round5_eliminated_teams",
  "round4_place",
  "round4_eliminated_teams",
  "round3_place",
  "round3_eliminated_teams",
  "round2_place",
  "round2_eliminated_teams",
  "round1_place",
  "round1_eliminated_teams",
];

const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const TableHistoryAllRound = ({ arrHistory, score }) => {
  if (!arrHistory) return null;

  const columns = useMemo(() => {
    if (!arrHistory[0]) return [];
    return Object.keys(arrHistory[0])
      .filter((key) => !EXCLUDED_KEYS.includes(key))
      .map((key) => ({
        header: capitalize(key.replace(/_/g, " ")),
        accessorKey: key,
      }));
  }, [arrHistory]);

  return (
    <TableBase
      data={arrHistory}
      columns={columns}
      title={score}
      maxHeight="60vh"
    />
  );
};

export default memo(TableHistoryAllRound);
