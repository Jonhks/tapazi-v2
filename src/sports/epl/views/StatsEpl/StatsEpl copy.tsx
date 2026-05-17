// import { useMemo, useState } from "react";
// import classes from "./StatsEpl.module.css";
// import {
//   FormControl,
//   FormControlLabel,
//   Radio,
//   RadioGroup,
//   Typography,
//   Zoom,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Box,
//   Input,
//   InputAdornment,
// } from "@mui/material";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import SearchIcon from "@mui/icons-material/Search";
// import { styled } from "@mui/material/styles";
// import DropDownHistory from "../../components/Inputs/DropdDownHistory";
// import Grid from "@mui/material/Grid2";
// import { getStatsEpl } from "@/api/epl/StatsEplAPI";
// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import Loader from "../../components/EPLBallLoader/EPLBallLoader";
// import { getTeamsEpl } from "@/api/epl/PortfoliosEplAPI";

// import {
//   useReactTable,
//   getCoreRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   flexRender,
//   SortingState,
//   ColumnDef,
// } from "@tanstack/react-table";

// type TeamStat = {
//   id: number;
//   name: string;
//   description: string;
//   key: string;
//   seed: number;
//   crest_url: string;
// };

// type PortfolioStat = {
//   portfolio: string;
//   teams: string;
//   week_score: number;
// };

// type TeamWithCrest = {
//   name: string;
//   crest: string | null;
// };

// type PortfolioWithCrests = {
//   portfolio: string;
//   week_score: number;
//   teams: TeamWithCrest[];
// };

// // Custom styled components for the table to match the UI in the image
// const StyledTableContainer = styled(TableContainer)(() => ({
//   backgroundColor: "transparent",
//   boxShadow: "none",
//   overflow: "auto",
//   "&::-webkit-scrollbar": {
//     width: "8px",
//   },
//   "&::-webkit-scrollbar-track": {
//     background: "#0d0211",
//   },
//   "&::-webkit-scrollbar-thumb": {
//     background: "#333",
//     borderRadius: "10px",
//   },
//   "&::-webkit-scrollbar-thumb:hover": {
//     background: "#555",
//   },
// }));

// const StyledHeaderCell = styled(TableCell)(() => ({
//   backgroundColor: "#22092c",
//   color: "#ffffff",
//   fontWeight: "bold",
//   textAlign: "center",
//   border: "none",
//   padding: "8px 4px",
//   fontSize: "0.85rem",
//   textTransform: "uppercase",
// }));

// const StyledBodyCell = styled(TableCell)(() => ({
//   color: "#ffffff",
//   textAlign: "center",
//   border: "none",
//   padding: "12px 8px",
//   fontSize: "0.9rem",
// }));

// const StyledTableRow = styled(TableRow)(() => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: "#15051a",
//   },
//   "&:nth-of-type(even)": {
//     backgroundColor: "#22092c",
//   },
//   "&:hover": {
//     backgroundColor: "rgba(255, 255, 255, 0.05)",
//   },
// }));

// const TeamDisplay = ({ name, crest }: { name: string; crest: string }) => (
//   <Box
//     display="flex"
//     alignItems="center"
//     justifyContent="start"
//     gap={1}
//   >
//     {/* Placeholder for team logo - in a real app these would be assets */}
//     <Box
//       sx={{
//         width: 24,
//         height: 24,
//         backgroundColor: "rgba(255,255,255,0.1)",
//         backgroundImage: `url(${crest})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         borderRadius: "50%",
//       }}
//     />
//     <Typography
//       variant="body2"
//       sx={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
//     >
//       {name}
//     </Typography>
//   </Box>
// );

// const StatsEpl = () => {
//   const [tournament, setTournament] = useState("MEN'S BB TOURNAMENT 2025");
//   const [dataType, setDataType] = useState("SCORE");
//   const [scoreType, setScoreType] = useState("CURRENT SCORE");
//   const [sortOrder, setSortOrder] = useState("Score (Desc)");

//   // Mock data that matches the image provided by the user
//   const tournaments = [{ id: "1", name: "MEN'S BB TOURNAMENT 2025" }];
//   const dataTypes = [{ id: "1", name: "SCORE" }];
//   const scoreTypes = [{ id: "1", name: "CURRENT SCORE" }];
//   const params = useParams();
//   const userId = params.userId!;

//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [filtered, setFiltered] = useState<string>("");

//   const { data: statsEplData, isLoading } = useQuery({
//     queryKey: ["statsEpl", userId],
//     queryFn: () => getStatsEpl(),
//   });

//   const { data: teamsEplStats } = useQuery({
//     queryKey: ["teamsEplStats", userId],
//     queryFn: () => getTeamsEpl("2"),
//   });

//   const teamsMap: Record<string, string> = teamsEplStats?.reduce(
//     (acc: Record<string, string>, team: TeamStat) => {
//       acc[team.name] = team.crest_url;
//       return acc;
//     },
//     {},
//   );

//   const statsWithCrests: PortfolioWithCrests[] = statsEplData?.map(
//     (item: PortfolioStat) => {
//       const teams: string[] = JSON.parse(item.teams);

//       const teamsWithCrests: TeamWithCrest[] = teams.map(
//         (teamName: string) => ({
//           name: teamName,
//           crest: teamsMap[teamName] ?? null,
//         }),
//       );

//       return {
//         portfolio: item.portfolio,
//         week_score: item.week_score,
//         teams: teamsWithCrests,
//       };
//     },
//   );

//   const columns = useMemo<ColumnDef<PortfolioWithCrests>[]>(
//     () => [
//       {
//         header: "Portfolio",
//         accessorKey: "portfolio",
//         cell: (info: any) => (
//           <span style={{ color: "#05fa87" }}>{info.getValue() as string}</span>
//         ),
//       },

//       ...Array.from({ length: 7 }, (_, i) => ({
//         header: `Team ${i + 1}`,
//         // Flatten the search functionality directly into the accessor
//         accessorFn: (row: PortfolioWithCrests) => row.teams?.[i]?.name || "",
//         id: `team_${i}`,
//         cell: (info: any) => {
//           const teamName = info.getValue() as string;
//           // Look up original team object to get crest since accessor now only holds string name
//           const originalRow = info.row.original as PortfolioWithCrests;
//           const fullTeam = originalRow.teams?.[i];

//           return teamName && fullTeam ? (
//             <TeamDisplay
//               name={teamName}
//               crest={fullTeam.crest || ""}
//             />
//           ) : null;
//         },
//       })),

//       {
//         header: () => (
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               lineHeight: 1,
//             }}
//           >
//             <span>W</span>
//             <span>SCORE</span>
//           </Box>
//         ),
//         accessorKey: "week_score",
//       },
//     ],
//     [],
//   );

//   const table = useReactTable({
//     data: statsWithCrests || [],
//     columns,
//     state: { sorting, globalFilter: filtered },
//     onSortingChange: setSorting,
//     onGlobalFilterChange: setFiltered,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//   });

//   const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSortOrder((event.target as HTMLInputElement).value);
//   };

//   if (isLoading) return <Loader />;

//   return (
//     <Grid
//       style={{
//         minHeight: "700px",
//         height: "calc(100vh - 56px)",
//         overflow: "scroll",
//       }}
//     >
//       <Grid
//         container
//         size={12}
//         spacing={1}
//         display={"flex"}
//         justifyContent={"center"}
//         alignContent={"center"}
//         flexWrap={"nowrap"}
//         sx={{ width: "100%", maxWidth: "100%" }}
//       >
//         <div className={`${classes.boxHistory} ${classes.active}`}>
//           <div
//             className={classes.titleBox}
//             style={{ justifyContent: "center" }}
//           >
//             STATS
//           </div>
//           <div className={classes.subBoxHistory}>
//             <Grid
//               container
//               spacing={4}
//             >
//               {/* Left Column: Dropdowns */}
//               <Grid size={{ xs: 12, md: 7 }}>
//                 <Grid
//                   container
//                   spacing={2}
//                   alignItems="center"
//                 >
//                   {/* Tournament Row */}
//                   <Grid size={4}>
//                     <Typography
//                       sx={{ color: "white", textAlign: "right", pr: 2 }}
//                     >
//                       Tournament:
//                     </Typography>
//                   </Grid>
//                   <Grid size={8}>
//                     <DropDownHistory
//                       name="tournament"
//                       label=""
//                       className={classes.DropDownHistory}
//                       value={tournament}
//                       handleChange={(e) =>
//                         setTournament(e.target.value as string)
//                       }
//                       options={tournaments}
//                     />
//                   </Grid>

//                   {/* Data Row */}
//                   <Grid size={4}>
//                     <Typography
//                       sx={{ color: "white", textAlign: "right", pr: 2 }}
//                     >
//                       Data:
//                     </Typography>
//                   </Grid>
//                   <Grid size={8}>
//                     <DropDownHistory
//                       name="data"
//                       label=""
//                       className={classes.DropDownHistory}
//                       value={dataType}
//                       handleChange={(e) =>
//                         setDataType(e.target.value as string)
//                       }
//                       options={dataTypes}
//                     />
//                   </Grid>

//                   {/* Score Row */}
//                   <Grid size={4}>
//                     <Typography
//                       sx={{ color: "white", textAlign: "right", pr: 2 }}
//                     >
//                       Score:
//                     </Typography>
//                   </Grid>
//                   <Grid size={8}>
//                     <DropDownHistory
//                       name="score"
//                       label=""
//                       className={classes.DropDownHistory}
//                       value={scoreType}
//                       handleChange={(e) =>
//                         setScoreType(e.target.value as string)
//                       }
//                       options={scoreTypes}
//                     />
//                   </Grid>
//                 </Grid>
//               </Grid>

//               {/* Right Column: Radio Buttons */}
//               <Grid
//                 size={{ xs: 12, md: 5 }}
//                 display="flex"
//                 justifyContent="center"
//               >
//                 <FormControl>
//                   <RadioGroup
//                     aria-labelledby="demo-radio-buttons-group-label"
//                     name="radio-buttons-group"
//                     value={sortOrder}
//                     onChange={handleSortChange}
//                   >
//                     <FormControlLabel
//                       value="Score (Desc)"
//                       control={
//                         <Radio
//                           sx={{
//                             color: "white",
//                             "&.Mui-checked": { color: "#05fa87" },
//                           }}
//                         />
//                       }
//                       label={
//                         <Typography color="white">Score (Desc)</Typography>
//                       }
//                     />
//                     <FormControlLabel
//                       value="gap (Asc)"
//                       control={
//                         <Radio
//                           sx={{
//                             color: "white",
//                             "&.Mui-checked": { color: "#05fa87" },
//                           }}
//                         />
//                       }
//                       label={
//                         <Typography color="white">Portfolio (Asc)</Typography>
//                       }
//                     />
//                     <FormControlLabel
//                       value="Weight (Desc)"
//                       control={
//                         <Radio
//                           sx={{
//                             color: "white",
//                             "&.Mui-checked": { color: "#05fa87" },
//                           }}
//                         />
//                       }
//                       label={
//                         <Typography color="white">Weight (Desc)</Typography>
//                       }
//                     />
//                     <FormControlLabel
//                       value="Weight (Asc)"
//                       control={
//                         <Radio
//                           sx={{
//                             color: "white",
//                             "&.Mui-checked": { color: "#05fa87" },
//                           }}
//                         />
//                       }
//                       label={
//                         <Typography color="white">Weight (Asc)</Typography>
//                       }
//                     />
//                   </RadioGroup>
//                 </FormControl>
//               </Grid>
//             </Grid>
//           </div>
//         </div>
//       </Grid>

//       <Grid
//         container
//         spacing={2}
//         display={"flex"}
//         justifyContent={"center"}
//         alignContent={"center"}
//         mt={2}
//         mb={3}
//       >
//         <Zoom in={true}>
//           <Grid size={11.5}>
//             <Box sx={{ width: "100%", textAlign: "center", mb: 2 }}>
//               <Typography
//                 variant="h5"
//                 sx={{
//                   color: "white",
//                   fontWeight: "bold",
//                   textTransform: "uppercase",
//                 }}
//               >
//                 Score
//               </Typography>
//             </Box>
//             <Box
//               sx={{
//                 width: "100%",
//                 borderRadius: "4px",
//               }}
//             >
//               <div
//                 style={{
//                   position: "sticky",
//                   left: 0,
//                   top: 0,
//                   zIndex: 3,
//                   backgroundColor: "#d6cfcfff",
//                   color: "black",
//                   width: 200,
//                   borderRadius: 5,
//                   margin: "0 0 10px 0",
//                   padding: 0,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                 }}
//               >
//                 <Input
//                   type={"search"}
//                   sx={{
//                     width: "100%",
//                     padding: "0",
//                   }}
//                   placeholder="Search..."
//                   color={"warning"}
//                   value={filtered ?? ""}
//                   onChange={(e) => setFiltered(String(e.target.value))}
//                   startAdornment={
//                     <InputAdornment
//                       position="start"
//                       sx={{ pl: 1 }}
//                     >
//                       <SearchIcon color="inherit" />
//                     </InputAdornment>
//                   }
//                   inputProps={{
//                     style: { textTransform: "lowercase", padding: "5px" },
//                     autoCapitalize: "none",
//                   }}
//                 />
//               </div>
//               <div style={{ width: "100%", overflowX: "auto" }}>
//                 <table
//                   style={{
//                     width: "100%",
//                     borderCollapse: "collapse",
//                   }}
//                 >
//                   <thead>
//                     {table.getHeaderGroups().map((headerGroup) => (
//                       <tr key={headerGroup.id}>
//                         {headerGroup.headers.map((header, index) => (
//                           <th
//                             key={header.id}
//                             onClick={header.column.getToggleSortingHandler()}
//                             style={{
//                               position:
//                                 index === 0 || index === columns.length - 1
//                                   ? "sticky"
//                                   : "static",
//                               left: index === 0 ? 0 : undefined,
//                               right:
//                                 index === columns.length - 1 ? 0 : undefined,
//                               backgroundColor: "#200930",
//                               zIndex:
//                                 index === 0 || index === columns.length - 1
//                                   ? 4
//                                   : 2,
//                               color: "white",
//                               fontWeight: "bold",
//                               fontSize: "14px",
//                               textAlign: "center",
//                               padding: "12px",
//                               cursor: "pointer",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {header.isPlaceholder ? null : (
//                               <div
//                                 style={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                 }}
//                               >
//                                 <div>
//                                   {flexRender(
//                                     header.column.columnDef.header,
//                                     header.getContext(),
//                                   )}
//                                 </div>
//                                 <span
//                                   style={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                   }}
//                                 >
//                                   {{
//                                     asc: (
//                                       <ArrowUpwardIcon
//                                         style={{
//                                           fontSize: "20px",
//                                           marginLeft: "4px",
//                                         }}
//                                       />
//                                     ),
//                                     desc: (
//                                       <ArrowUpwardIcon
//                                         style={{
//                                           transform: "rotate(180deg)",
//                                           fontSize: "20px",
//                                           marginLeft: "4px",
//                                         }}
//                                       />
//                                     ),
//                                   }[header.column.getIsSorted() as string] ?? (
//                                     <ArrowUpwardIcon
//                                       style={{
//                                         color: "gray",
//                                         fontSize: "18px",
//                                         marginLeft: "4px",
//                                       }}
//                                     />
//                                   )}
//                                 </span>
//                               </div>
//                             )}
//                           </th>
//                         ))}
//                       </tr>
//                     ))}
//                   </thead>
//                   <tbody>
//                     {table.getRowModel().rows.map((row) => (
//                       <tr key={row.id}>
//                         {row.getVisibleCells().map((cell, index) => (
//                           <td
//                             key={cell.id}
//                             className={
//                               index !== 0 && index !== columns.length - 1
//                                 ? classes.cell
//                                 : undefined
//                             }
//                             style={{
//                               position:
//                                 index === 0 || index === columns.length - 1
//                                   ? "sticky"
//                                   : "static",
//                               left: index === 0 ? 0 : undefined,
//                               right:
//                                 index === columns.length - 1 ? 0 : undefined,
//                               backgroundColor:
//                                 index === 0 || index === columns.length - 1
//                                   ? "#200930"
//                                   : "#380f51",
//                               zIndex:
//                                 index === 0 || index === columns.length - 1
//                                   ? 3
//                                   : 1,
//                               color: "white",
//                               fontWeight: "bold",
//                               fontSize: "12px",
//                               textAlign: "center",
//                               padding: "8px",
//                               whiteSpace: "nowrap",
//                             }}
//                           >
//                             {flexRender(
//                               cell.column.columnDef.cell,
//                               cell.getContext(),
//                             )}
//                           </td>
//                         ))}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </Box>
//           </Grid>
//         </Zoom>
//       </Grid>
//     </Grid>
//   );
// };

// export default StatsEpl;
