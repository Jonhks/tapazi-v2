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
  function createData(year, tournament_name, total_weight, total_points) {
    return {
      year,
      tournament_name,
      total_weight,
      total_points,
    };
  }

  const rows = [
    arrHistory?.map((row) =>
      createData(
        row?.year,
        row.tournament_name,
        row?.total_weight,
        row?.total_points
      )
    ),
  ];

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
            <StyledTableCell>Year</StyledTableCell>
            <StyledTableCell>Tournament</StyledTableCell>
            <StyledTableCell>Total weight</StyledTableCell>
            <StyledTableCell>Total points</StyledTableCell>
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
              <StyledTableCell>{row?.total_weight}</StyledTableCell>
              <StyledTableCell>{row?.total_points}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
