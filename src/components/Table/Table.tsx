import * as React from "react";
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
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
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
  participantScore,
  othersParticipants,
}) {
  function createData(
    portfolioName,
    portfolioWeight,
    team1Name,
    team2Name,
    team3Name,
    team4Name,
    team5Name,
    team6Name,
    team7Name,
    team8Name,
    score,
    champGamePoint,
    paid
  ) {
    return {
      portfolioName,
      portfolioWeight,
      team1Name,
      team2Name,
      team3Name,
      team4Name,
      team5Name,
      team6Name,
      team7Name,
      team8Name,
      score,
      champGamePoint,
      paid,
    };
  }

  const participant = participantScore;
  const others = othersParticipants;
  const rows = [
    participant?.map((row) =>
      createData(
        row?.portfolioName,
        row?.portfolioWeight,
        row?.team1Name,
        row?.team2Name,
        row?.team3Name,
        row?.team4Name,
        row?.team5Name,
        row?.team6Name,
        row?.team7Name,
        row?.team8Name,
        row?.score,
        row?.championshipPoints,
        row?.paid
      )
    ),
    others?.map((row) =>
      createData(
        row?.portfolioName,
        row?.portfolioWeight,
        row?.team1Name,
        row?.team2Name,
        row?.team3Name,
        row?.team4Name,
        row?.team5Name,
        row?.team6Name,
        row?.team7Name,
        row?.team8Name,
        row?.score,
        row?.championshipPoints,
        row?.paid
      )
    ),
  ];

  return (
    <TableContainer
      component={Paper}
      sx={{ backgroundColor: "transparent" }}
    >
      <Table
        sx={{ minWidth: 100, opacity: ".87" }}
        aria-label="customized table"
      >
        <TableHead>
          <TableRow className={classes?.tableRow}>
            <StyledTableCell>Portfolio Name</StyledTableCell>
            <StyledTableCell>Portfolio Weight</StyledTableCell>
            <StyledTableCell>Team1</StyledTableCell>
            <StyledTableCell>Team2</StyledTableCell>
            <StyledTableCell>Team3</StyledTableCell>
            <StyledTableCell>Team4</StyledTableCell>
            <StyledTableCell>Team5</StyledTableCell>
            <StyledTableCell>Team6</StyledTableCell>
            <StyledTableCell>Team7</StyledTableCell>
            <StyledTableCell>Team8</StyledTableCell>
            <StyledTableCell>Score</StyledTableCell>
            <StyledTableCell>Championship Game Points</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.flat()?.map((row, i) => (
            <StyledTableRow key={i}>
              <StyledTableCell
                component="th"
                scope="row"
              >
                {/* {console.log(row)} */}
                {row?.portfolioName}
              </StyledTableCell>
              <StyledTableCell>{row?.portfolioWeight}</StyledTableCell>
              <StyledTableCell>{row?.team1Name}</StyledTableCell>
              <StyledTableCell>{row?.team2Name}</StyledTableCell>
              <StyledTableCell>{row?.team3Name}</StyledTableCell>
              <StyledTableCell>{row?.team4Name}</StyledTableCell>
              <StyledTableCell>{row?.team5Name}</StyledTableCell>
              <StyledTableCell>{row?.team6Name}</StyledTableCell>
              <StyledTableCell>{row?.team7Name}</StyledTableCell>
              <StyledTableCell>{row?.team8Name}</StyledTableCell>
              <StyledTableCell>{row?.score}</StyledTableCell>
              <StyledTableCell
                className={`${row?.paid ? classes.green : classes.red} `}
              >
                {row.champGamePoint}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
