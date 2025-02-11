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
    fontSize: 10,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 10,
    color: "white",
    border: "2px solid #eaad2b",
    fontWeight: "bold",
    padding: "8px",
  },
  "&.fixed": {
    position: "sticky",
    left: 0,
    backgroundColor: "#572d03",
    zIndex: 1,
  },
  "&.fixed + &.fixed": {
    left: "120px", // Ajusta este valor según el ancho de la columna `portfolioName`
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

const numeration = [
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
];

export default function CustomizedTables({ arrHistory, score }) {
  function createData(seed, number, percentage) {
    return {
      seed,
      number,
      percentage,
    };
  }

  const rows = [
    numeration?.map((row, i) => {
      return createData(
        row,
        arrHistory[0][`teams_seed${i + 1}`],
        arrHistory[0][`prcnt_teams_seed${i + 1}`]
      );
    }),
  ];

  return (
    <TableContainer
      component={Paper}
      sx={{ backgroundColor: "#572d03", overflowX: "auto", maxHeight: "50vh" }}
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
            <StyledTableCell>Seed</StyledTableCell>
            <StyledTableCell>Number</StyledTableCell>
            <StyledTableCell>Percentage</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.flat()?.map((row, i) => (
            <StyledTableRow key={i}>
              <StyledTableCell
                component="th"
                scope="row"
              >
                {row?.seed}
              </StyledTableCell>
              <StyledTableCell>{row?.number}</StyledTableCell>
              <StyledTableCell>{row?.percentage}%</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
