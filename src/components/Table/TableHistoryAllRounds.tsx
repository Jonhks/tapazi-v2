// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { memo } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import classes from "./Table.module.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#572d03",
    color: theme.palette.common.white,
    opacity: 0.9,
    fontSize: 10,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 11,
    color: "white",
    border: "2px solid #eaad2b",
    fontWeight: "bold",
    padding: 2,
    padding: "7px",
  },
  "&.fixed": {
    position: "sticky",
    left: 0,
    backgroundColor: "#572d03",
    zIndex: 1,
  },
  "&.fixed + &.fixed": {
    left: "50px", // Ajusta este valor según el ancho de la columna `year`
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#874607",
    color: "white",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#e27d25",
    color: "white",
  },
  "&:last-child td, &:last-child th": {},
}));

const TableHistoryAllRound = ({ arrHistory, score }) => {
  if (!arrHistory) return null;
  const createData = (
    year,
    portfolio_name,
    portfolio_weight,
    final_place,
    final_score,
    round5_score,
    round4_score,
    round3_score,
    round2_score,
    round1_score,
    total_wins,
    perfect_score,
    perfect_weight,
    hist_perform,
    roi,
    risk_adjusted
  ) => {
    return {
      year,
      portfolio_name,
      portfolio_weight,
      final_place,
      final_score,
      round5_score,
      round4_score,
      round3_score,
      round2_score,
      round1_score,
      total_wins,
      perfect_score,
      perfect_weight,
      hist_perform,
      roi,
      risk_adjusted,
    };
  };

  const rows = [
    arrHistory?.map((row) =>
      createData(
        row.year,
        row.portfolio_name,
        row.portfolio_weight,
        row.final_place,
        row.final_score,
        row.round5_score,
        row.round4_score,
        row.round3_score,
        row.round2_score,
        row.round1_score,
        row.total_wins,
        row.perfect_score,
        row.perfect_weight,
        row.hist_perform,
        row.roi,
        row.risk_adjusted
      )
    ),
  ];

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getCapitalizedProperties = (obj: object) => {
    return Object.keys(obj)
      .filter(
        (key) =>
          key !== "tournament_name" &&
          key !== "consecutive" &&
          key !== "round5_place" &&
          key !== "round5_eliminated_teams" &&
          key !== "round4_place" &&
          key !== "round4_eliminated_teams" &&
          key !== "round3_place" &&
          key !== "round3_eliminated_teams" &&
          key !== "round2_place" &&
          key !== "round2_eliminated_teams" &&
          key !== "round1_place" &&
          key !== "round1_eliminated_teams"
      )
      .map((key) => capitalizeFirstLetter(key.replace(/_/g, " ")));
  };

  const capitalizedProperties = getCapitalizedProperties(arrHistory[0]);

  return (
    <TableContainer
      component={Paper}
      sx={{ backgroundColor: "#572d03", overflowX: "auto", maxHeight: "60vh" }}
    >
      <div className={`${classes?.firstTableRow} ${classes.fixed}`}>
        {score}
      </div>
      <Table
        sx={{ minWidth: 100, opacity: ".87" }}
        aria-label="customized table"
      >
        <TableHead
          style={{
            position: "sticky",
            top: "0px",
            zIndex: 2,
          }}
        >
          <TableRow className={classes?.tableRow}>
            {capitalizedProperties.map((property, i) => (
              <StyledTableCell
                key={i}
                className={i === 0 || i === 1 ? "fixed" : ""}
              >
                {property}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.flat()?.map((row, i) => (
            <StyledTableRow key={i}>
              <StyledTableCell
                component="th"
                scope="row"
                className="fixed"
              >
                {row?.year}
              </StyledTableCell>
              <StyledTableCell className="fixed">
                {row?.portfolio_name}
              </StyledTableCell>
              <StyledTableCell>{row?.portfolio_weight}</StyledTableCell>
              <StyledTableCell>{row?.final_place}</StyledTableCell>
              <StyledTableCell>{row?.final_score}</StyledTableCell>
              <StyledTableCell>{row?.round5_score}</StyledTableCell>
              <StyledTableCell>{row?.round4_score}</StyledTableCell>
              <StyledTableCell>{row?.round3_score}</StyledTableCell>
              <StyledTableCell>{row?.round2_score}</StyledTableCell>
              <StyledTableCell>{row?.round1_score}</StyledTableCell>
              <StyledTableCell>{row?.total_wins}</StyledTableCell>
              <StyledTableCell>{row?.perfect_score}</StyledTableCell>
              <StyledTableCell>{row?.perfect_weight}</StyledTableCell>
              <StyledTableCell>{row?.hist_perform}</StyledTableCell>
              <StyledTableCell>{row?.roi}</StyledTableCell>
              <StyledTableCell>{row?.risk_adjusted}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default memo(TableHistoryAllRound);
