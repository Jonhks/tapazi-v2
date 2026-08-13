import { useMemo, useState } from "react";
import { ColumnDef, Cell } from "@tanstack/react-table";
import { TableBase } from "@/shared/components/Table/TableBase";
import { sportThemes } from "@/shared/theme/colors";
import { NewPortfolio, ScoresNflHome, Tournament } from "@/types/index";
import ModalTableHome from "../../Modal/Modal";
import { extractWeekNumber } from "@/utils/formulas";

const NFL_WEEKS = 38;
const CURRENT_ROUND_BG = "#4a3a0a";

type NflRow = ScoresNflHome extends (infer R)[] ? R : ScoresNflHome;

const weekColumns: ColumnDef<NflRow>[] = Array.from(
  { length: NFL_WEEKS },
  (_, i) => ({
    header: `Week ${i + 1}`,
    accessorKey: `score_week${i + 1}`,
  }),
);

const columns: ColumnDef<NflRow>[] = [
  { header: "Name", accessorKey: "name" },
  { header: "Portfolio ID", accessorKey: "portfolio_id" },
  ...weekColumns,
  { header: "Score", accessorKey: "score" },
];

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
