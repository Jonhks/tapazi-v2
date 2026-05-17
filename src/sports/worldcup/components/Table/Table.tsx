import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  TableBase as SharedTableBase,
  TableBaseProps,
} from "@/shared/components/Table/TableBase";
import { sportThemes } from "@/shared/theme/colors";
import { HomeScoreWC } from "@/types/index";

// ─── Wrapper pre-configurado con el tema Copa del Mundo ───────────────────────

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

// ─── TeamDisplay — celda de equipo con escudo y estado eliminado ──────────────

const TeamDisplay = ({
  name,
  crest,
  eliminated,
}: {
  name: string;
  crest: string | null;
  eliminated: boolean;
}) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
    {crest ? (
      <span style={{
        width: 20, height: 20, flexShrink: 0, borderRadius: "50%",
        backgroundImage: `url(${crest})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
        display: "inline-block",
        filter: eliminated ? "grayscale(1)" : "none",
        opacity: eliminated ? 0.5 : 1,
      }} />
    ) : null}
    <span style={{ fontSize: "0.75rem", textDecoration: eliminated ? "line-through" : "none", color: eliminated ? "#888" : "inherit" }}>
      {name}
    </span>
  </span>
);

// ─── TableHomeWC — tabla principal de la home worldcup ───────────────────────

interface Props {
  data: HomeScoreWC[];
}

const ROUND_COLS: { header: string; key: keyof HomeScoreWC }[] = [
  { header: "Group Round 1",        key: "group_round_1" },
  { header: "Group Round 2",        key: "group_round_2" },
  { header: "Group Round 3",        key: "group_round_3" },
  { header: "Round of 32",          key: "round_of_32" },
  { header: "Round of 16",          key: "round_of_16" },
  { header: "Quarter-Finals",       key: "quarter_finals" },
  { header: "Semi-Finals",          key: "semi_finals" },
  { header: "Third-place play-off", key: "third_place_playoff" },
  { header: "Final",                key: "final" },
];

const TableHomeWC = ({ data }: Props) => {
  const columns = useMemo<ColumnDef<HomeScoreWC>[]>(
    () => [
      { header: "Portfolio Name", accessorKey: "portfolio_name" },
      { header: "Portfolio ID",   accessorKey: "portfolio_id" },
      ...[1, 2, 3, 4, 5, 6, 7].map(
        (n): ColumnDef<HomeScoreWC> => ({
          header: `Team ${n}`,
          accessorKey: `team${n}_name`,
          cell: ({ row }) => (
            <TeamDisplay
              name={row.original[`team${n}_name` as keyof HomeScoreWC] as string}
              crest={row.original[`team${n}_crest` as keyof HomeScoreWC] as string | null}
              eliminated={row.original[`team${n}_eliminated` as keyof HomeScoreWC] as boolean}
            />
          ),
        }),
      ),
      ...ROUND_COLS.map(({ header, key }): ColumnDef<HomeScoreWC> => ({
        header,
        accessorKey: key as string,
        cell: ({ row }) => {
          const val = row.original[key];
          return val != null ? String(val) : "";
        },
      })),
      { header: "Score", accessorKey: "score" },
    ],
    [],
  );

  return (
    <TableBase
      data={data}
      columns={columns}
      maxHeight="600px"
      stickyLastColumn
    />
  );
};

export default TableHomeWC;
