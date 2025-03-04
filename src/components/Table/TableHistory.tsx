// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useState } from "react";
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
    padding: "7px",
  },
  "&.fixed": {
    position: "sticky",
    left: 0,
    backgroundColor: "#572d03",
    zIndex: 1,
  },
  "&.fixed + &.fixed": {
    left: "75px", // Ajusta este valor según el ancho de la columna `portfolioName`
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

export default function CustomizedTables({ arrHistory, score }) {
  const [showEliminatedTeams, setShowEliminatedTeams] = useState(false);

  useEffect(() => {
    const findEliminatedTeams = arrHistory?.filter((el) => el?.eliminatedTeams);
    if (findEliminatedTeams) {
      if (findEliminatedTeams[0]) {
        setShowEliminatedTeams(true);
      } else {
        setShowEliminatedTeams(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrHistory]);

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
    wins,
    score,
    championshipPoints,
    eliminatedTeams
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
      wins,
      score,
      championshipPoints,
      eliminatedTeams,
    };
  }

  const rows = [
    arrHistory?.map((row) =>
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
        row?.wins,
        row?.score,
        row?.championshipPoints,
        row?.eliminatedTeams
      )
    ),
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
            <StyledTableCell className="fixed">Portfolio Name</StyledTableCell>
            <StyledTableCell className="fixed">
              Portfolio Weight
            </StyledTableCell>
            <StyledTableCell>Team1</StyledTableCell>
            <StyledTableCell>Team2</StyledTableCell>
            <StyledTableCell>Team3</StyledTableCell>
            <StyledTableCell>Team4</StyledTableCell>
            <StyledTableCell>Team5</StyledTableCell>
            <StyledTableCell>Team6</StyledTableCell>
            <StyledTableCell>Team7</StyledTableCell>
            <StyledTableCell>Team8</StyledTableCell>
            <StyledTableCell>Wins</StyledTableCell>
            <StyledTableCell>Score</StyledTableCell>
            {showEliminatedTeams ? (
              <StyledTableCell>Eliminated Teams</StyledTableCell>
            ) : (
              <StyledTableCell>Championship Game Points</StyledTableCell>
            )}
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
                {row?.portfolioName}
              </StyledTableCell>
              <StyledTableCell className="fixed">
                {row?.portfolioWeight}
              </StyledTableCell>
              <StyledTableCell>{row?.team1Name}</StyledTableCell>
              <StyledTableCell>{row?.team2Name}</StyledTableCell>
              <StyledTableCell>{row?.team3Name}</StyledTableCell>
              <StyledTableCell>{row?.team4Name}</StyledTableCell>
              <StyledTableCell>{row?.team5Name}</StyledTableCell>
              <StyledTableCell>{row?.team6Name}</StyledTableCell>
              <StyledTableCell>{row?.team7Name}</StyledTableCell>
              <StyledTableCell>{row?.team8Name}</StyledTableCell>
              <StyledTableCell>{row?.wins}</StyledTableCell>
              <StyledTableCell>{row?.score}</StyledTableCell>
              {showEliminatedTeams ? (
                <StyledTableCell>{row.eliminatedTeams}</StyledTableCell>
              ) : (
                <StyledTableCell>{row?.championshipPoints}</StyledTableCell>
              )}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
