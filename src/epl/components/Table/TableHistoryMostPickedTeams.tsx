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
import { MostPickedTeams } from "@/types/index";

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
  least,
}: {
  arrHistory: MostPickedTeams[];
  score: string;
  least?: boolean;
}) {
  function createData(
    percentage_portfolios,
    team_name,
    times_picked,
    tournament_name
    // year
  ) {
    return {
      percentage_portfolios,
      team_name,
      times_picked,
      tournament_name,
      // year,
    };
  }

  const rows = [
    arrHistory?.map((row) =>
      createData(
        row?.percentage_portfolios,
        row?.team_name,
        row?.times_picked,
        row?.tournament_name
        // row?.year
      )
    ),
  ];

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: "#572d03",
        overflowX: "auto",
        maxHeight: "40vh",
      }}
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
            {!least && (
              <StyledTableCell className="fixed">
                Tournamet name
              </StyledTableCell>
            )}
            <StyledTableCell>Team name</StyledTableCell>
            <StyledTableCell>Times picked</StyledTableCell>
            <StyledTableCell>Percentage portfolios</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.flat()?.map((row, i) => (
            <StyledTableRow key={i}>
              {/* <StyledTableCell
                component="th"
                scope="row"
                className="fixed"
              >
                {row?.year}
              </StyledTableCell> */}
              {!least && (
                <StyledTableCell className="fixed">
                  {row?.tournament_name}
                </StyledTableCell>
              )}
              <StyledTableCell>{row?.team_name}</StyledTableCell>
              <StyledTableCell>{row?.times_picked}</StyledTableCell>
              <StyledTableCell>{row?.percentage_portfolios}%</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
