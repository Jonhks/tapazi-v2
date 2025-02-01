// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

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
    fontSize: 12,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    color: "white",
    border: "2px solid #eaad2b",
    fontWeight: "bold",
    padding: 2,
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

export default function CustomizedTables({ arrHistory, score }) {
  if (!arrHistory) return null;
  function createData(
    year,
    tournament_name,
    total_wins,
    round5_score,
    round5_place,
    round5_eliminated_teams,
    round4_score,
    round4_place,
    round4_eliminated_teams,
    round3_score,
    round3_place,
    round3_eliminated_teams,
    round2_score,
    round2_place,
    round2_eliminated_teams,
    round1_score,
    round1_place,
    round1_eliminated_teams,
    roi,
    risk_adjusted,
    portfolio_weight,
    portfolio_name,
    perfect_weight,
    perfect_score,
    hist_perform,
    final_score,
    final_place,
    consecutive
  ) {
    return {
      year,
      tournament_name,
      total_wins,
      round5_score,
      round5_place,
      round5_eliminated_teams,
      round4_score,
      round4_place,
      round4_eliminated_teams,
      round3_score,
      round3_place,
      round3_eliminated_teams,
      round2_score,
      round2_place,
      round2_eliminated_teams,
      round1_score,
      round1_place,
      round1_eliminated_teams,
      roi,
      risk_adjusted,
      portfolio_weight,
      portfolio_name,
      perfect_weight,
      perfect_score,
      hist_perform,
      final_score,
      final_place,
      consecutive,
    };
  }

  const rows = [
    arrHistory?.map((row) =>
      createData(
        row.year,
        row.tournament_name,
        row.total_wins,
        row.round5_score,
        row.round5_place,
        row.round5_eliminated_teams,
        row.round4_score,
        row.round4_place,
        row.round4_eliminated_teams,
        row.round3_score,
        row.round3_place,
        row.round3_eliminated_teams,
        row.round2_score,
        row.round2_place,
        row.round2_eliminated_teams,
        row.round1_score,
        row.round1_place,
        row.round1_eliminated_teams,
        row.roi,
        row.risk_adjusted,
        row.portfolio_weight,
        row.portfolio_name,
        row.perfect_weight,
        row.perfect_score,
        row.hist_perform,
        row.final_score,
        row.final_place,
        row.consecutive
      )
    ),
  ];

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getCapitalizedProperties = (obj: object) => {
    return Object.keys(obj).map((key) => capitalizeFirstLetter(key));
  };

  const capitalizedProperties = getCapitalizedProperties(arrHistory[0]);

  console.log(capitalizedProperties);

  return (
    <TableContainer
      component={Paper}
      sx={{ backgroundColor: "#572d03" }}
    >
      <div className={classes?.firstTableRow}>{score}</div>
      <Table
        sx={{ minWidth: 100, opacity: ".87" }}
        aria-label="customized table"
      >
        <TableHead>
          <TableRow className={classes?.tableRow}>
            {capitalizedProperties.map((property, i) => (
              <StyledTableCell key={i}>{property}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.flat()?.map((row, i) => (
            <StyledTableRow key={i}>
              <StyledTableCell
                component="th"
                scope="row"
              >
                {row?.year}
              </StyledTableCell>
              <StyledTableCell>{row?.tournament_name}</StyledTableCell>
              <StyledTableCell>{row?.consecutive}</StyledTableCell>
              <StyledTableCell>{row?.portfolio_name}</StyledTableCell>
              <StyledTableCell>{row?.portfolio_weight}</StyledTableCell>
              <StyledTableCell>{row?.final_place}</StyledTableCell>
              <StyledTableCell>{row?.final_score}</StyledTableCell>
              <StyledTableCell>{row?.total_wins}</StyledTableCell>
              <StyledTableCell>{row?.round5_score}</StyledTableCell>
              <StyledTableCell>{row?.round5_eliminated_teams}</StyledTableCell>
              <StyledTableCell>{row?.round5_place}</StyledTableCell>
              <StyledTableCell>{row?.round4_score}</StyledTableCell>
              <StyledTableCell>{row?.round4_eliminated_teams}</StyledTableCell>
              <StyledTableCell>{row?.round4_place}</StyledTableCell>
              <StyledTableCell>{row?.round3_score}</StyledTableCell>
              <StyledTableCell>{row?.round3_eliminated_teams}</StyledTableCell>
              <StyledTableCell>{row?.round3_place}</StyledTableCell>
              <StyledTableCell>{row?.round2_score}</StyledTableCell>
              <StyledTableCell>{row?.round2_eliminated_teams}</StyledTableCell>
              <StyledTableCell>{row?.round2_place}</StyledTableCell>
              <StyledTableCell>{row?.round1_score}</StyledTableCell>
              <StyledTableCell>{row?.round1_eliminated_teams}</StyledTableCell>
              <StyledTableCell>{row?.round1_place}</StyledTableCell>
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
}
