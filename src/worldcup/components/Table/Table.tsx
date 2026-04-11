import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  TableBase as SharedTableBase,
  TableBaseProps,
} from "@/shared/components/Table/TableBase";
import { sportThemes } from "@/shared/theme/colors";
import { OtherScores, ParticipantsScores } from "@/types/index";
import classes from "./Table.module.css";

// ─── Wrapper pre-configurado con el tema Copa del Mundo ───────────────────────
// accentFirstColumn activa el color cyan en la primera columna

export function TableBase<T>(props: Omit<TableBaseProps<T>, "theme">) {
  return (
    <SharedTableBase
      {...props}
      theme={sportThemes.worldcup}
      accentFirstColumn
    />
  );
}

// ─── Ícono balón de fútbol ────────────────────────────────────────────────────

export const SoccerBallSvg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="#ffffff"
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    style={{ verticalAlign: "middle", marginRight: 4, flexShrink: 0 }}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.93V15l-3-3 1-4 3-1 3 1 1 4-3 3v1.93C9.39 17.72 7 15.06 7 12c0-.34.03-.67.08-1H9l2 2v-1l-1-3h4l-1 3v1l2-2h1.92c.05.33.08.66.08 1 0 3.06-2.39 5.72-5 5.93z" />
  </svg>
);

// ─── TableParticipants — tabla principal de la home worldcup ─────────────────

interface Props {
  participantScore: ParticipantsScores;
  othersParticipants: OtherScores[];
}

const TableParticipants = ({ participantScore, othersParticipants }: Props) => {
  const mergedData: OtherScores[] = useMemo(() => {
    const participantArray = Array.isArray(participantScore)
      ? (participantScore as OtherScores[])
      : [];
    const othersArray = Array.isArray(othersParticipants)
      ? othersParticipants
      : [];
    return [...participantArray, ...othersArray];
  }, [participantScore, othersParticipants]);

  const columns = useMemo<ColumnDef<OtherScores>[]>(
    () => [
      { header: "Portfolio Entry", accessorKey: "portfolio_name" },
      { header: "Portfolio Weight", accessorKey: "portfolio_weight" },
      ...[1, 2, 3, 4, 5, 6, 7, 8].map(
        (n): ColumnDef<OtherScores> => ({
          header: `Team ${n}`,
          accessorKey: `team${n}_name`,
          cell: ({ row }) => {
            const teamName =
              row.original[`team${n}_name` as keyof OtherScores];
            return (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {teamName && <SoccerBallSvg />}
                {teamName}
              </span>
            );
          },
        }),
      ),
      { header: "Score", accessorKey: "score" },
      {
        header: "Championship Game Point",
        accessorKey: "championship_points",
        cell: ({ row }) => {
          const { paid, championship_points } = row.original;
          return (
            <span className={paid ? classes.green : classes.red}>
              {championship_points}
            </span>
          );
        },
      },
    ],
    [],
  );

  return (
    <TableBase
      data={mergedData}
      columns={columns}
      maxHeight="600px"
      stickyLastColumn
    />
  );
};

export default TableParticipants;
