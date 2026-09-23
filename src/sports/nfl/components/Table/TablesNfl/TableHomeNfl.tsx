import { useMemo, useState } from "react";
import { ColumnDef, Cell } from "@tanstack/react-table";
import { TableBase } from "@/shared/components/Table/TableBase";
import { sportThemes } from "@/shared/theme/colors";
import { NewPortfolio, ScoresNflHome, Tournament } from "@/types/index";
import ModalTableHome from "../../Modal/Modal";
import { extractWeekNumber } from "@/utils/formulas";

const CURRENT_ROUND_BG = "#4a3a0a";

type NflRow = ScoresNflHome extends (infer R)[] ? R : ScoresNflHome;

const WEEK_KEY_PATTERN = /^score_week(\d+)$/;

// El número de semanas sale del propio dato de tournaments/:id/score/home
// (una semana por cada score_weekN presente en las filas), no de un valor
// fijo — así la tabla no se desincroniza si el largo de temporada cambia.
const getWeekColumns = (rows: NflRow[]): ColumnDef<NflRow>[] => {
  let maxWeek = 0;
  rows.forEach((row) => {
    Object.keys(row ?? {}).forEach((key) => {
      const match = key.match(WEEK_KEY_PATTERN);
      if (match) maxWeek = Math.max(maxWeek, Number(match[1]));
    });
  });
  return Array.from({ length: maxWeek }, (_, i) => ({
    header: `Week ${i + 1}`,
    accessorKey: `score_week${i + 1}`,
  }));
};

const TableHomeNfl = ({
  data,
  tournament,
}: {
  data: ScoresNflHome;
  tournament: Tournament;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [week, setWeek] = useState("1");
  const [portfolioId, setPortfolioId] = useState("1");
  const [portfolio, setPortfolio] = useState<NewPortfolio>({} as NewPortfolio);

  const rows: NflRow[] = useMemo(
    () => (Array.isArray(data) ? data : [data]),
    [data],
  );

  const columns: ColumnDef<NflRow>[] = useMemo(
    () => [
      { header: "Name", accessorKey: "name" },
      { header: "Portfolio ID", accessorKey: "portfolio_id" },
      ...getWeekColumns(rows),
      { header: "Score", accessorKey: "score" },
    ],
    [rows],
  );

  const handleCellClick = (cell: Cell<NflRow, unknown>, colIndex: number) => {
    // Ignorar columnas sticky (Name, Portfolio ID, Score)
    if (colIndex === 0 || colIndex === 1 || colIndex === columns.length - 1)
      return;
    setPortfolioId(String(cell.row.original.portfolio_id));
    setWeek(extractWeekNumber(cell.id)?.toString() ?? "1");
    setPortfolio(cell.row.original as unknown as NewPortfolio);
    setOpenModal(true);
  };

  const highlightColBg = (colId: string): string | null => {
    const weekNum = extractWeekNumber(colId);
    return weekNum === String(tournament?.current_round)
      ? CURRENT_ROUND_BG
      : null;
  };

  const headerTooltip = (colId: string): string | null => {
    const weekNum = extractWeekNumber(colId);
    return weekNum === String(tournament?.current_round) ? "Current Round" : null;
  };

  return (
    <>
      <ModalTableHome
        openModal={openModal}
        setOpenModal={setOpenModal}
        week={week}
        portfolioId={portfolioId}
        portfolio={portfolio}
        tournamentId={String(tournament?.id ?? "")}
      />
      <TableBase
        data={rows}
        columns={columns}
        theme={sportThemes.nfl}
        stickyLastColumn
        stickySecondColumn
        col0Width={120}
        onCellClick={handleCellClick}
        highlightColBg={highlightColBg}
        headerTooltip={headerTooltip}
      />
    </>
  );
};

export default TableHomeNfl;
