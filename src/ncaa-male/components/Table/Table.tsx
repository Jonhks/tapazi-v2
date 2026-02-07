import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import classes from "./Table.module.css";
import { OtherScores, ParticipantsScores } from "@/types/index";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: "center",
  [`&.${tableCellClasses.head}`]: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#380F55", // Color para elementos pares
      opacity: 0.8,
      color: "white",
    },
    "&:nth-of-type(even)": {
      backgroundColor: "#2C0C37", // Color para elementos pares
      opacity: 0.8,
      color: "white",
    },
    "&.fixed + &.fixed": {
      left: "75px", // Ajusta este valor según el ancho de la columna `portfolioName`
    },
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    "&:nth-of-type(odd)": {
      backgroundColor: "#220931", // Color para elementos pares
      opacity: 0.8,
      color: "white",
    },
    "&:nth-of-type(even)": {
      backgroundColor: "#19071F", // Color para elementos pares
      opacity: 0.8,
      color: "white",
    },
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
    padding: "8px",
    border: "none",
  },
  "&.fixed": {
    position: "sticky",
    left: 0,
    zIndex: 1,
  },
  "&.fixed:nth-of-type(odd)": {
    backgroundColor: "#250B2E", // Color para elementos impares
    color: "#05fa87",
    fontfamily: "Montserrat, sans-serif",
    fontsize: 20,
    opacity: 0.9,
  },
  "&.fixed:nth-of-type(even)": {
    backgroundColor: "#2D0E35", // Color para elementos pares
    opacity: 0.9,
    color: "white",
  },
  "&.fixed + &.fixed": {
    left: "75px", // Ajusta este valor según el ancho de la columna `portfolioName`
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  backgroundColor: "red",
  "&:nth-of-type(odd)": {
    backgroundColor: "#220931",
    color: "white",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#300F40",
    color: "white",
  },
}));

export default function CustomizedTables({
  participantScore,
  othersParticipants,
}: {
  participantScore: ParticipantsScores;
  othersParticipants: OtherScores;
}) {
  function createData(
    portfolio_name: OtherScores["portfolio_name"],
    portfolio_weight: OtherScores["portfolio_weight"],
    team1_name: OtherScores["team1_name"],
    team2_name: OtherScores["team2_name"],
    team3_name: OtherScores["team3_name"],
    team4_name: OtherScores["team4_name"],
    team5_name: OtherScores["team5_name"],
    team6_name: OtherScores["team6_name"],
    team7_name: OtherScores["team7_name"],
    team8_name: OtherScores["team8_name"],
    score: OtherScores["score"],
    championship_points: OtherScores["championship_points"],
    paid: OtherScores["paid"],
  ) {
    return {
      portfolio_name,
      portfolio_weight,
      team1_name,
      team2_name,
      team3_name,
      team4_name,
      team5_name,
      team6_name,
      team7_name,
      team8_name,
      score,
      championship_points,
      paid,
    };
  }

  const participant: OtherScores[] | undefined = participantScore as
    | OtherScores[]
    | undefined;
  const others = Array.isArray(othersParticipants) ? othersParticipants : [];
  const rows = [
    participant?.map((row: OtherScores) =>
      createData(
        row?.portfolio_name,
        row?.portfolio_weight,
        row?.team1_name,
        row?.team2_name,
        row?.team3_name,
        row?.team4_name,
        row?.team5_name,
        row?.team6_name,
        row?.team7_name,
        row?.team8_name,
        row?.score,
        row?.championship_points,
        row?.paid,
      ),
    ),
    others?.map((row) =>
      createData(
        row?.portfolio_name,
        row?.portfolio_weight,
        row?.team1_name,
        row?.team2_name,
        row?.team3_name,
        row?.team4_name,
        row?.team5_name,
        row?.team6_name,
        row?.team7_name,
        row?.team8_name,
        row?.score,
        row?.championship_points,
        row?.paid,
      ),
    ),
  ];
  // console.log(rows);

  return (
    <TableContainer
      component={Paper}
      sx={{ backgroundColor: "transparent", maxHeight: "580px" }}
    >
      <Table
        sx={{ minWidth: 100, opacity: "1" }}
        aria-label="customized table"
      >
        <TableHead sx={{ position: "sticky", top: 0, zIndex: 2 }}>
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
                className="fixed"
              >
                {row?.portfolio_name}
              </StyledTableCell>
              <StyledTableCell className="fixed">
                {row?.portfolio_weight}
              </StyledTableCell>
              <StyledTableCell>{row?.team1_name}</StyledTableCell>
              <StyledTableCell>{row?.team2_name}</StyledTableCell>
              <StyledTableCell>{row?.team3_name}</StyledTableCell>
              <StyledTableCell>{row?.team4_name}</StyledTableCell>
              <StyledTableCell>{row?.team5_name}</StyledTableCell>
              <StyledTableCell>{row?.team6_name}</StyledTableCell>
              <StyledTableCell>{row?.team7_name}</StyledTableCell>
              <StyledTableCell>{row?.team8_name}</StyledTableCell>
              <StyledTableCell>{row?.score}</StyledTableCell>
              <StyledTableCell
                className={`${row?.paid ? classes.green : classes.red} `}
              >
                {row?.championship_points}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
