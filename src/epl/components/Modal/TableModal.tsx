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
  result: number,
  type: string,
  crest_url?: string
) {
  return { team_name, seed, multiplier, result, type, crest_url };
}

export default function DenseTable({ data }: { data: ScorePortfoliosTable }) {
  const isMobile = useMediaQuery("(max-width:700px)");
  const style = {
    color: "white",
    fontSize: isMobile ? "0.7rem" : ".9rem",
    fontWeight: "bold",
  };

  const rows = data.map((item) => {
    return createData(
      item.team_name,
      item.seed,
      item.streak_multiplier,
      Number(item.team_id),
      item.type,
      item.crest_url
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
      sx={{
        "&::-webkit-scrollbar": {
          display: "none", // Oculta las barras de desplazamiento en navegadores WebKit
        },
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
            <TableCell
              style={{
                ...style,
                position: "sticky",
                left: 0,
                background: "#200930",
                zIndex: 2,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "visible",
              }}
            >
              Team
            </TableCell>
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
                style={{
                  ...style,
                  position: "sticky",
                  left: 0,
                  background: "#200930",
                  zIndex: 2,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  {row.crest_url && (
                    <img
                      src={row.crest_url}
                      alt={row.team_name}
                      style={{
                        width: isMobile ? 20 : 25,
                        height: isMobile ? 20 : 25,
                        objectFit: "contain",
                        borderRadius: "4px",
                      }}
                    />
                  )}
                  {/* {console.log(row)} */}
                  {row.team_name}
                </span>
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
                {row.type}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
