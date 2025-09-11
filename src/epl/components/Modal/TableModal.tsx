import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ScorePortfoliosTable } from "../../../types";
import { useMediaQuery } from "@mui/material";
function createData(
  team_name: string,
  seed: number,
  multiplier: number,
  result: number
) {
  return { team_name, seed, multiplier, result };
}

export default function DenseTable({ data }: { data: ScorePortfoliosTable }) {
  const isMobile = useMediaQuery("(max-width:700px)");

  const style = {
    color: "white",
    fontSize: isMobile ? "0.7rem" : "1rem",
    fontWeight: "bold",
  };

  const rows = data.map((item) => {
    return createData(
      item.team_name,
      item.seed,
      item.streak_multiplier,
      item.team_id
    );
  });

  return (
    <TableContainer
      component={Paper}
      style={{
        backgroundColor: "transparent",
        padding: 0,
        color: "white",
        maxHeight: "50vh",
        overflow: "scroll",
      }}
    >
      <Table
        sx={{
          minWidth: 650,
          width: "100%",
          color: "white",
          overflow: "scroll",
        }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          <TableRow style={{ backgroundColor: "#200930" }}>
            <TableCell style={style}>Team</TableCell>
            <TableCell
              style={style}
              align="right"
            >
              Seed
            </TableCell>
            <TableCell
              style={style}
              align="right"
            >
              Multiplier
            </TableCell>
            <TableCell
              style={style}
              align="right"
            >
              Result
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.team_name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell
                component="th"
                scope="row"
                style={style}
              >
                {row.team_name}
              </TableCell>
              <TableCell
                style={style}
                align="right"
              >
                {row.seed}
              </TableCell>
              <TableCell
                style={style}
                align="right"
              >
                {row.multiplier}
              </TableCell>
              <TableCell
                style={style}
                align="right"
              >
                {row.result}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
