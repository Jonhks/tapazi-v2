// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unsafe-optional-chaining */

import React, { useCallback, useEffect, useState, memo } from "react";
import {
  Box,
  // Tabs,
  // Tab,
  // Button,
  // Input,
  // InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./MyPortfolioEPL.module.css";
// import { BallIcon } from "@/assets/icons/icons";
// import Dropdown from "@/components/Inputs/Dropdown";
import Loader from "@/epl/components/EPLBallLoader/EPLBallLoader";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Divider from "@mui/material/Divider";

// import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
// import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import { getPortfolios } from "@/api/epl/PortfoliosEplAPI";
import {
  // getDATTOU,
  // getHOUTOU,
  // getPortfolios,
  getTeams,
  // getWinnerOfTeam,
  postNewPortfolio,
  // removeportfolio,
} from "@/api/PortfoliosAPI";
import { Portfolios } from "@/types/index";
import { toast } from "react-toastify";
// import Swal from "sweetalert2";
// import { isDateTimeReached } from "@/utils/getDaysLeft";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

const MyPortfolioEPL = () => {
  const params = useParams();
  const userId = params.userId!;
  // const sportId = params.sportId!;
  const queryClient = useQueryClient();

  const [value, setValue] = React.useState(0);
  const [portfolios, setPortfolios] = useState<Portfolios>([]);
  // const [error, setError] = useState(false);
  // const [editing, setEditing] = useState(false);
  // const [duplicates, setDuplicates] = useState(false);
  // const [focused, setFocused] = useState(false);
  const [championshipPoints, setChampionshipPoints] = useState("");
  const [validTournament, setValidTournament] = useState(false);
  // const [comparing, setComparing] = useState([]);
  // const [winnerSelected, setWinnerSelected] = useState(false);

  const [selectedTeams, setSelectedTeams] = useState(Array(5).fill(""));
  // const [teamSelected, setTeamSelected] = useState([]);

  useEffect(() => {
    if (portfolios) {
      setChampionshipPoints(portfolios[value]?.championshipPoints);
    }
  }, [portfolios, value]);

  const { data: portfoliosObtained, isLoadingPortfoliosObtained } = useQuery({
    queryKey: ["portfoliosEpl", userId],
    queryFn: () => getPortfolios(userId),
  });

  // console.log(getAllPortfoliosEpl);

  const { data: teamsEPL, isLoading } = useQuery({
    queryKey: ["teamsEpl", userId],
    queryFn: () => getTeams(2),
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });

  // console.log(teamsEPL);

  const { mutate: postNewPortfolioMutate } = useMutation({
    mutationFn: postNewPortfolio,
    onSuccess: (resp) => {
      toast.success(resp);
      queryClient.invalidateQueries(["portfolios", userId]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (
      portfoliosObtained &&
      portfoliosObtained.length > 0 &&
      teamsEPL &&
      portfoliosObtained[0].teams
    ) {
      console.log(portfoliosObtained[0].teams);

      setSelectedTeams(
        portfoliosObtained[0].teams.map((team) => {
          if (typeof team === "object" && team !== null && team.id) {
            const found = teamsEPL.find((opt) => opt.id === team.id);
            return found ? found.name : "";
          }
          return "";
        })
      );
      setChampionshipPoints(
        portfoliosObtained[0].championshipPoints?.toString() ?? ""
      );
      setPortfolios(portfoliosObtained);
    } else {
      setSelectedTeams(Array(5).fill(""));
      setChampionshipPoints("");
      setPortfolios([]);
    }
  }, [portfoliosObtained, teamsEPL]);

  // useEffect(() => {
  //   if (portfoliosObtained && portfoliosObtained.length > 0) {
  //     // Rellena los inputs con los datos del primer portfolio
  //     setSelectedTeams(
  //       portfoliosObtained[0].teams.map((team) =>
  //         typeof team === "object" && team !== null ? team.name ?? "" : ""
  //       )
  //     );
  //     setChampionshipPoints(
  //       portfoliosObtained[0].championshipPoints?.toString() ?? ""
  //     );
  //     setPortfolios(portfoliosObtained);
  //   } else {
  //     // Si no hay datos, limpia los inputs para permitir ingreso manual
  //     setSelectedTeams(Array(5).fill(""));
  //     setChampionshipPoints("");
  //     setPortfolios([]);
  //   }
  // }, [portfoliosObtained]);

  // console.log(portfolios);

  // const { data: dataDATTOU } = useQuery({
  //   queryKey: ["dattou", userId],
  //   queryFn: () => getDATTOU(userId),
  // });

  // const { data: dataHOUTOU } = useQuery({
  //   queryKey: ["houtou", userId],
  //   queryFn: () => getHOUTOU(userId),
  // });

  // const { data: winnerOfTeam } = useQuery({
  //   queryKey: ["winnerOfTeam", userId],
  //   queryFn: () => getWinnerOfTeam(),
  // });

  // useEffect(() => {
  // if (winnerOfTeam) {
  //   Promise.all(
  //     winnerOfTeam?.map((el) => getWinnerOfTeamHasTeam(el?.id))
  //   ).then((resp) => {
  //     const formattedData = winnerOfTeam?.map((winner, index) => {
  //       return {
  //         winnerOfTeam: winner?.id,
  //         winnerOfTeamHasTeam: resp[index]?.map((team) => team?.teamId),
  //       };
  //     });
  //     setComparing(formattedData);
  //   });
  // }
  // }, [winnerOfTeam]);

  // useEffect(() => {
  //   if (dataDATTOU && dataHOUTOU) {
  //     const isValid = isDateTimeReached(dataDATTOU, dataHOUTOU);
  //     setValidTournament(isValid);
  //   }
  // }, [dataDATTOU, dataHOUTOU, portfolios]);

  // const { mutate: removeportfolioMutate } = useMutation({
  //   mutationFn: removeportfolio,
  //   onSuccess: (resp) => {
  //     toast.success(resp);
  //   },
  //   onError: (error) => {
  //     toast.error(error.message);
  //   },
  // });

  // useEffect(() => {
  //   setPortfolios(portfoliosObtained);
  // }, [portfoliosObtained]);

  // interface CustomTabPanelProps {
  //   children: React.ReactNode;
  //   value: number;
  //   index: number;
  // }

  // function CustomTabPanel(props: CustomTabPanelProps) {
  //   const { children, value, index, ...other } = props;
  //   return (
  //     <div
  //       role="tabpanel"
  //       hidden={value !== index}
  //       id={`simple-tabpanel-${index}`}
  //       aria-labelledby={`simple-tab-${index}`}
  //       {...other}
  //     >
  //       {value === index && (
  //         <Box sx={{ p: 3 }}>
  //           <div>{children}</div>
  //         </Box>
  //       )}
  //     </div>
  //   );
  // }

  // function a11yProps(index: number) {
  //   return {
  //     id: `simple-tab-${index}`,
  //     "aria-controls": `simple-tabpanel-${index}`,
  //   };
  // }

  // const handleChange = useCallback((event, newValue) => {
  //   setValue(newValue);
  // }, []);

  // const handleChangeInput = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const newValue = event.target.value;
  //   const regex = /^(?:[1-9][0-9]{0,2}|0)$/;
  //   if (!regex.test(newValue)) {
  //     setChampionshipPoints("");
  //     return;
  //   }
  //   setChampionshipPoints(event.target.value);
  //   const newData = portfolios.map((el) => {
  //     if (el?.newPortfolio) {
  //       return {
  //         ...el,
  //         championshipPoints: +e?.target?.value,
  //       };
  //     } else {
  //       return el;
  //     }
  //   });
  //   setPortfolios(newData);
  //   setFocused(true);
  // };

  // const checkCombination = (arr, arrIds) => {
  //   for (let i = 0; i < arrIds.length; i++) {
  //     for (let j = 0; j < arrIds.length; j++) {
  //       if (i !== j) {
  //         const winnerOfTeam = arrIds[i];
  //         const teamId = arrIds[j];
  //         const exists = arr.some(
  //           (item) =>
  //             item.winnerOfTeam === winnerOfTeam &&
  //             item.winnerOfTeamHasTeam.includes(teamId)
  //         );
  //         if (exists) {
  //           toast.error(
  //             "You cannot select a team that also belongs to the selection of a winner of team!!"
  //           );
  //           setWinnerSelected(true);
  //           return true;
  //         } else {
  //           setWinnerSelected(false);
  //         }
  //       }
  //     }
  //   }
  //   return false;
  // };

  // useEffect(() => {
  //   if (portfolios) {
  //     if (portfolios[value]) {
  //       const arrIds = portfolios[value].teams.map((port) => port.id);
  //       checkCombination(comparing, arrIds);
  //     }
  //   }
  // }, [comparing, portfolios, value]);

  // console.log(portfolios);
  // ? Ya funciona, solo guarda los estados locales para los inputs. Guarda el nombre
  const handleChangeSelect = useCallback(
    (team: string, index: number) => {
      const newSelectedTeams = [...selectedTeams];
      newSelectedTeams[index] = team;
      setSelectedTeams(newSelectedTeams);
    },
    [selectedTeams]
  );
  // console.log(portfolios);

  // const sendPortfolio = useCallback(() => {
  //   console.log(portfolios);
  //   //     const swalWithBootstrapButtons = Swal.mixin({});
  //   //     swalWithBootstrapButtons
  //   //       .fire({
  //   //         title: "Are you sure?",
  //   //         text: "You won't be able to revert this!",
  //   //         icon: "warning",
  //   //         confirmButtonColor: "#238b94",
  //   //         showCancelButton: true,
  //   //         confirmButtonText: "Yes, send it to!",
  //   //         cancelButtonText: "No, cancel!",
  //   //         reverseButtons: true,
  //   //       })
  //   //       .then(async (result) => {
  //   //         if (result.isConfirmed) {
  //   //           const sendData = {
  //   //             port,
  //   //             portfolios,
  //   //             userId,
  //   //           };
  //   //           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   //           // @ts-expect-error
  //   //           mutate(sendData);
  //   //           try {
  //   //             swalWithBootstrapButtons.fire({
  //   //               title: "Saved!",
  //   //               text: "your portfolio has been saved.",
  //   //               icon: "success",
  //   //             });
  //   //           } catch {
  //   //             swalWithBootstrapButtons.fire({
  //   //               title: "Saved!",
  //   //               text: "an error has occurred.",
  //   //               icon: "error",
  //   //             });
  //   //           }
  //   //         } else if (
  //   //           /* Read more about handling dismissals below */
  //   //           result.dismiss === Swal.DismissReason.cancel
  //   //         ) {
  //   //           swalWithBootstrapButtons.fire({
  //   //             title: "Cancelled",
  //   //             text: "Don't worry, you can still continue editing your portfolio :)",
  //   //             icon: "error",
  //   //           });
  //   //         }
  //   //       });
  // }, [
  //   portfolios,
  //   //  mutate,
  //   // userId,
  // ]);
  // console.log(validTournament);

  const addportFolio = useCallback(() => {
    const allFilled = selectedTeams.every((team) => team !== "");

    // ? Verifica que los portfolios vayan llenos
    if (!allFilled) {
      toast.error("You must select all teams!");
      setValidTournament(true);

      setTimeout(() => {
        setValidTournament(false);
      }, 2500);
      return;
    }
    const newPortfolio = {
      tournament_id: "2",
      participant_id: userId,
      championshipPoints: 0,
      teams: selectedTeams.map((team) => {
        if (team === "") return false;
        const found = teamsEPL?.find((opt) => opt.name === team);
        return found ? { id: found.id } : false;
      }),
    };
    // Solo guarda un portfolio, actualizándolo
    setPortfolios([newPortfolio]);

    // const allFilled = newPortfolio.teams.every((team) => team !== false);
    // if (allFilled) {
    //   console.log("All teams are filled");
    // } else {
    //   console.log("Some teams are not filled");
    // }
    postNewPortfolioMutate({
      port: newPortfolio,
      userId: userId,
    });
    // console.log([newPortfolio]);
  }, [selectedTeams, teamsEPL, userId, postNewPortfolioMutate]);

  // console.log(portfolios);

  // const savePortfolio = useCallback(() => {
  //   if (!validTournament) {
  //     toast.error("The tournament has already started!!");
  //     return;
  //   }
  //   const newData = [...portfolios];
  //   const portFolioEditable = [
  //     ...newData?.filter((port) => port?.newPortfolio),
  //   ][0];
  //   const portfoliExist = portFolioEditable?.teams?.some((el) => el === false);

  //   if (portFolioEditable?.championshipPoints >= 1 && !portfoliExist) {
  //     const teamsId = portFolioEditable?.teams?.map((el) => {
  //       if (typeof el === "object") {
  //         return { id: el.id };
  //       }
  //     });
  //     sendPortfolio({
  //       championshipPoints: portFolioEditable?.championshipPoints,
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //       // @ts-expect-error
  //       teamsId,
  //     });
  //     setChampionshipPoints("");
  //     setFocused(false);
  //     setError(false);
  //     setEditing(false);
  //   } else if (
  //     portFolioEditable?.championshipPoints >= 1 &&
  //     portFolioEditable?.teams?.some((el) => el === false)
  //   ) {
  //     setError(true);
  //     setTimeout(() => setError(false), 1000);
  //     toast.error("You must select all Teams!");
  //   } else {
  //     setError(true);
  //     setTimeout(() => setError(false), 1000);
  //     toast.error("All fields are mandatory!!");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [portfolios]);

  // const removeportfolioFunction = useCallback(
  //   (portId: number) => {
  //     toast.error("Portfolio deleted successfully!");

  //     //   const index = portfolios.findIndex(
  //     //     (portfolio) => portfolio.id === portId
  //     //   );
  //     //   setValue(index);
  //     //   const swalWithBootstrapButtons = Swal.mixin({});
  //     //   swalWithBootstrapButtons
  //     //     .fire({
  //     //       title: `Are you sure to delete the portfolio ${portId}`,
  //     //       text: "You won't be able to revert this!",
  //     //       icon: "warning",
  //     //       showCancelButton: true,
  //     //       confirmButtonColor: "#238b94",
  //     //       confirmButtonText: "Yes, delete it!",
  //     //       cancelButtonText: "No, cancel!",
  //     //       reverseButtons: true,
  //     //     })
  //     //     .then(async (result) => {
  //     //       if (result.isConfirmed) {
  //     //         setPortfolios(portfolios?.filter((el) => el?.id !== portId));
  //     //         const sendData = {
  //     //           portId,
  //     //           portfolios,
  //     //           userId,
  //     //         };
  //     //         await removeportfolioMutate(sendData);
  //     //         try {
  //     //           swalWithBootstrapButtons.fire({
  //     //             title: "Deleted!",
  //     //             text: "Your file has been deleted.",
  //     //             icon: "success",
  //     //           });
  //     //           if (index > 0) {
  //     //             setValue(index - 1);
  //     //           } else {
  //     //             setValue(index);
  //     //           }
  //     //         } catch {
  //     //           swalWithBootstrapButtons.fire({
  //     //             title: "Error!",
  //     //             text: "an error has occurred.",
  //     //             icon: "error",
  //     //           });
  //     //         }
  //     //       } else if (
  //     //         /* Read more about handling dismissals below */
  //     //         result.dismiss === Swal.DismissReason.cancel
  //     //       ) {
  //     //         swalWithBootstrapButtons.fire({
  //     //           title: "Cancelled",
  //     //           text: "Don't worry, you can still continue editing your portfolio :)",
  //     //           icon: "error",
  //     //         });
  //     //         setValue(index);
  //     //       }
  //     //     });
  //   },
  //   [
  //     portfolios,
  //     // removeportfolioMutate,
  //     userId,
  //   ]
  // );

  // const cancelPortfolio = useCallback(() => {
  //   const swalWithBootstrapButtons = Swal.mixin({});
  //   swalWithBootstrapButtons
  //     .fire({
  //       title: "Are you sure?",
  //       text: "You won't be able to revert this!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonText: "Yes, delete it!",
  //       cancelButtonText: "No, cancel!",
  //       reverseButtons: true,
  //     })
  //     .then(async (result) => {
  //       if (result.isConfirmed) {
  //         if (value >= 1) {
  //           setValue(0);
  //         }
  //         setPortfolios(portfoliosObtained);
  //         setEditing(false);
  //         try {
  //           swalWithBootstrapButtons.fire({
  //             title: "Deleted!",
  //             text: "Your file has been deleted.",
  //             icon: "success",
  //           });
  //         } catch {
  //           swalWithBootstrapButtons.fire({
  //             title: "Error!",
  //             text: "an error has occurred.",
  //             icon: "error",
  //           });
  //         }
  //       } else if (result.dismiss === Swal.DismissReason.cancel) {
  //         swalWithBootstrapButtons.fire({
  //           title: "Cancelled",
  //           text: "Don't worry, you can still continue editing your portfolio :)",
  //           icon: "error",
  //         });
  //       }
  //     });
  // }, [portfoliosObtained, value]);

  // const options = [
  //   { value: "sunderland", label: "SUNDERLAND", icon: <SportsSoccerIcon /> },
  //   { value: "tottenham", label: "TOTTENHAM", icon: <SportsBasketballIcon /> },
  //   {
  //     value: "manchester-city",
  //     label: "MANCHESTER CITY",
  //     icon: <SportsSoccerIcon />,
  //   },
  //   {
  //     value: "west-ham-united",
  //     label: "WEST HAM UNITED",
  //     icon: <SportsBasketballIcon />,
  //   },
  //   {
  //     value: "aston-villa",
  //     label: "ASTON VILLA",
  //     icon: <SportsSoccerIcon />,
  //   },
  // ];

  // const renderTeams = () => {
  //   return [0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
  //     <FormControl
  //       key={idx}
  //       fullWidth
  //       sx={{
  //         backgroundColor: idx % 2 === 0 ? "#380f65" : "#200930",
  //         "& .MuiInputLabel-root": {
  //           color: "white",
  //           fontWeight: "bold",
  //           fontSize: "18px",
  //         },
  //       }}
  //     >
  //       <InputLabel
  //         id={`select-label-${idx}`}
  //         shrink={selected !== ""} // El label solo se muestra si no hay selección
  //         sx={{
  //           color: "white",
  //           fontWeight: "bold",
  //           fontSize: "18px",
  //           transition: "opacity 0.2s",
  //           opacity: selected ? 0 : 1, // Oculta visualmente el label si hay selección
  //         }}
  //       >
  //         Team
  //       </InputLabel>
  //       <Select
  //         labelId={`select-label-${idx}`}
  //         value={selected}
  //         label="Team"
  //         // onChange={(e) => setSelected(e.target.value)}
  //         onChange={(e) => handleChangeSelect(e.target.value, idx)}
  //         sx={{
  //           "& .MuiSelect-icon": {
  //             color: "white",
  //           },
  //         }}
  //       >
  //         {options.map((opt) => (
  //           <MenuItem
  //             key={opt.value}
  //             value={opt.value}
  //           >
  //             <div
  //               style={{
  //                 display: "flex",
  //                 flexDirection: "row",
  //                 justifyContent: "center",
  //                 alignItems: "center",
  //                 color: "white",
  //                 fontWeight: "bold",
  //                 fontSize: "18px",
  //               }}
  //             >
  //               <ListItemIcon style={{ color: "white" }}>
  //                 {opt.icon}
  //               </ListItemIcon>
  //               <ListItemText>{opt.label}</ListItemText>
  //             </div>
  //           </MenuItem>
  //         ))}
  //       </Select>
  //     </FormControl>
  //   ));
  // };
  // console.log(selectedTeams);

  const renderTeams = () => {
    return [0, 1, 2, 3, 4].map((idx) => {
      // Opciones disponibles para este select (excluye las ya seleccionadas en otros selects)
      const availableOptions = teamsEPL?.filter(
        (opt) =>
          !selectedTeams.includes(opt.name) || selectedTeams[idx] === opt.name
      );
      return (
        <FormControl
          key={idx}
          fullWidth
          sx={{
            backgroundColor: idx % 2 === 0 ? "#380f65" : "#200930",
            "& .MuiInputLabel-root": {
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
            },
          }}
        >
          <InputLabel
            id={`select-label-${idx}`}
            shrink={selectedTeams[idx] !== ""}
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: "18px",
              transition: "opacity 0.2s",
              opacity: selectedTeams[idx] ? 0 : 1,
            }}
          >
            Team
          </InputLabel>
          <Select
            labelId={`select-label-${idx}`}
            value={selectedTeams[idx]}
            label="Team"
            onChange={(e) => handleChangeSelect(e.target.value, idx)}
            sx={{
              "& .MuiSelect-icon": {
                color: "white",
              },
            }}
          >
            {availableOptions?.map((opt) => (
              <MenuItem
                key={opt.id}
                value={opt.name}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  <ListItemIcon style={{ color: "white" }}>
                    <img
                      src={opt.crest_url}
                      alt={opt.name}
                      style={{
                        width: 28,
                        height: 28,
                        objectFit: "contain",
                        marginRight: 8,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    style={{ textAlign: "left", fontWeight: "bold" }}
                  >
                    {opt.name}
                  </ListItemText>
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    });
  };

  if (isLoading || isLoadingPortfoliosObtained) return <Loader />;

  // if ((portfolios, portfoliosObtained))
  return (
    <Grid
      size={12}
      sx={{
        minHeight: "650px",
        height: "calc(100vh - 56px)",
        overflow: "scroll",
      }}
    >
      <Grid
        container
        spacing={2}
        justifyContent={"center"}
        alignContent={"center"}
      >
        <Grid size={{ xs: 12, sm: 8, lg: 6 }}>
          <Box
            component="section"
            className={classes.boxPortfolio}
            m={3}
          >
            <div className={classes.headerPortfolio}>
              <div style={{ color: "white" }}>
                <EmojiEventsOutlinedIcon
                  color="inherit"
                  style={{ fontSize: "2.6rem" }}
                />

                <h2 style={{ color: "#05fa87", fontSize: "40px" }}>
                  Portfolio{portfolios?.length > 1 && "s"}
                  <p style={{ fontSize: "14px" }}>{portfolios[0]?.name}</p>
                  {/* {portfolios?.length > 0 && portfolios?.length} */}
                </h2>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  color: "white",
                  fontSize: "24px",
                  textAlign: "center",
                }}
              >
                Tournament
              </h2>
              <Divider
                style={{
                  backgroundColor: "white",
                  width: "60%",
                }}
              />
            </div>
            <Grid
              size={12}
              style={{ marginTop: "30px" }}
            >
              <div
                style={{
                  width: "80%",
                  margin: "0 auto",
                  textAlign: "right",
                }}
              >
                {renderTeams()}
                {/* <Input
                  required
                  type="text"
                  autoFocus={focused}
                  value={championshipPoints ?? ""}
                  sx={{
                    width: "50%",
                    mt: 3,
                    color: "white",
                    "&:before": {
                      borderBottom: "2px solid white", // borde cuando NO está enfocado
                    },
                    "&:after": {
                      borderBottom: "2px solid #05fa87", // borde cuando está enfocado
                    },
                    "& input": {
                      color: "white",
                    },
                  }}
                  id="input-with-icon-adornment"
                  name="championshipPoints"
                  placeholder="Championship Points"
                  className={classes.championshipPoints}
                  inputProps={{
                    maxLength: 3,
                    inputMode: "numeric",
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <EmojiEventsOutlinedIcon color="inherit" />
                    </InputAdornment>
                  }
                  onChange={handleChangeInput}
                /> */}
              </div>
            </Grid>
            <Grid
              // item
              xs={12}
              mt={3}
              mb={2}
            >
              {validTournament && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <ErrorMessage>You must select all teams</ErrorMessage>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#05fa87",
                    width: "30%",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "14px",
                    margin: 10,
                  }}
                  onClick={addportFolio}
                >
                  SUBMIT
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  style={{
                    width: "30%",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                    margin: 10,
                  }}
                  onClick={() => removeportfolioFunction(1)}
                >
                  Cancel
                </Button>
              </div>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(MyPortfolioEPL);
