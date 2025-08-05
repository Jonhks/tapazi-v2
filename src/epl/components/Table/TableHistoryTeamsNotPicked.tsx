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
import { TeamsNotPicked } from "@/types/index";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#572d03",
    color: theme.palette.common.white,
    opacity: 0.9,
    fontSize: 11,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 11,
    color: "white",
    border: "2px solid #eaad2b",
    fontWeight: "bold",
    padding: "7px",
  },
  "&.fixed": {
    position: "sticky",
    left: 0,
    backgroundColor: "#572d03",
    zIndex: 1,
  },
  "&.fixed + &.fixed": {
    left: "60px", // Ajusta este valor según el ancho de la columna `portfolioName`
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
  "&:last-child td, &:last-child th": {
    // border: 0,
  },
}));

export default function CustomizedTables({
  arrHistory,
  score,
}: {
  arrHistory: TeamsNotPicked[];
  score: string;
}) {
  function createData(team_name, tournament_name, year) {
    return {
      team_name,
      tournament_name,
      year,
    };
  }

  const rows = [
    arrHistory?.map((row) =>
      createData(row?.team_name, row?.tournament_name, row?.year)
    ),
  ];

  return (
    <TableContainer
      component={Paper}
      sx={{ backgroundColor: "#572d03", overflowX: "auto", maxHeight: "35vh" }}
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
            <StyledTableCell>Year</StyledTableCell>
            <StyledTableCell className="fixed">Team</StyledTableCell>
            <StyledTableCell>Tournament</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.flat()?.map((row, i) => (
            <StyledTableRow key={i}>
              <StyledTableCell className="fixed">{row?.year}</StyledTableCell>
              <StyledTableCell>{row?.team_name}</StyledTableCell>
              <StyledTableCell>{row?.tournament_name}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
