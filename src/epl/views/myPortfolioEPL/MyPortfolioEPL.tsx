// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unsafe-optional-chaining */

import React, { useCallback, useEffect, useState, memo } from "react";
import {
  Box,
  Tabs,
  Tab,
  Button,
  Input,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./MyPortfolioEPL.module.css";
import { BallIcon } from "@/assets/icons/icons";
import Dropdown from "@/components/Inputs/Dropdown";
import Loader from "@/epl/components/EPLBallLoader/EPLBallLoader";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Divider from "@mui/material/Divider";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";

import {
  getDATTOU,
  getHOUTOU,
  getPortfolios,
  getTeams,
  getWinnerOfTeam,
  getWinnerOfTeamHasTeam,
  postNewPortfolio,
  removeportfolio,
} from "@/api/PortfoliosAPI";
import { Portfolios } from "@/types/index";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { isDateTimeReached } from "@/utils/getDaysLeft";

const MyPortfolioEPL = () => {
  const params = useParams();
  const userId = params.userId!;
  const queryClient = useQueryClient();

  const [value, setValue] = React.useState(0);
  const [portfolios, setPortfolios] = useState<Portfolios>([]);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [duplicates, setDuplicates] = useState(false);
  const [focused, setFocused] = useState(false);
  const [championshipPoints, setChampionshipPoints] = useState("");
  const [validTournament, setValidTournament] = useState(true);
  const [comparing, setComparing] = useState([]);
  const [winnerSelected, setWinnerSelected] = useState(false);

  useEffect(() => {
    if (portfolios) {
      setChampionshipPoints(portfolios[value]?.championshipPoints);
    }
  }, [portfolios, value]);

  const { data: portfoliosObtained, isLoading } = useQuery({
    queryKey: ["portfolios", userId],
    queryFn: () => getPortfolios(userId),
  });

  const { data: dataDATTOU } = useQuery({
    queryKey: ["dattou", userId],
    queryFn: () => getDATTOU(userId),
  });

  const { data: dataHOUTOU } = useQuery({
    queryKey: ["houtou", userId],
    queryFn: () => getHOUTOU(userId),
  });

  const { data: winnerOfTeam } = useQuery({
    queryKey: ["winnerOfTeam", userId],
    queryFn: () => getWinnerOfTeam(),
  });

  useEffect(() => {
    if (winnerOfTeam) {
      Promise.all(winnerOfTeam.map((el) => getWinnerOfTeamHasTeam(el.id))).then(
        (resp) => {
          const formattedData = winnerOfTeam.map((winner, index) => {
            return {
              winnerOfTeam: winner.id,
              winnerOfTeamHasTeam: resp[index].map((team) => team.teamId),
            };
          });
          setComparing(formattedData);
        }
      );
    }
  }, [winnerOfTeam]);

  useEffect(() => {
    if (dataDATTOU && dataHOUTOU) {
      const isValid = isDateTimeReached(dataDATTOU, dataHOUTOU);
      setValidTournament(isValid);
    }
  }, [dataDATTOU, dataHOUTOU, portfolios]);

  const { data: teams } = useQuery({
    queryKey: ["teams", userId],
    queryFn: () => getTeams(),
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });

  const { mutate } = useMutation({
    mutationFn: postNewPortfolio,
    onSuccess: (resp) => {
      toast.success(resp);
      queryClient.invalidateQueries(["portfolios", userId]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: removeportfolioMutate } = useMutation({
    mutationFn: removeportfolio,
    onSuccess: (resp) => {
      toast.success(resp);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    setPortfolios(portfoliosObtained);
  }, [portfoliosObtained]);

  interface CustomTabPanelProps {
    children: React.ReactNode;
    value: number;
    index: number;
  }

  function CustomTabPanel(props: CustomTabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <div>{children}</div>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;
    const regex = /^(?:[1-9][0-9]{0,2}|0)$/;
    if (!regex.test(newValue)) {
      setChampionshipPoints("");
      return;
    }
    setChampionshipPoints(event.target.value);
    const newData = portfolios.map((el) => {
      if (el?.newPortfolio) {
        return {
          ...el,
          championshipPoints: +e?.target?.value,
        };
      } else {
        return el;
      }
    });
    setPortfolios(newData);
    setFocused(true);
  };

  const checkCombination = (arr, arrIds) => {
    for (let i = 0; i < arrIds.length; i++) {
      for (let j = 0; j < arrIds.length; j++) {
        if (i !== j) {
          const winnerOfTeam = arrIds[i];
          const teamId = arrIds[j];
          const exists = arr.some(
            (item) =>
              item.winnerOfTeam === winnerOfTeam &&
              item.winnerOfTeamHasTeam.includes(teamId)
          );
          if (exists) {
            toast.error(
              "You cannot select a team that also belongs to the selection of a winner of team!!"
            );
            setWinnerSelected(true);
            return true;
          } else {
            setWinnerSelected(false);
          }
        }
      }
    }
    return false;
  };

  useEffect(() => {
    if (portfolios) {
      if (portfolios[value]) {
        const arrIds = portfolios[value].teams.map((port) => port.id);
        checkCombination(comparing, arrIds);
      }
    }
  }, [comparing, portfolios, value]);

  const handleChangeSelect = useCallback(
    (team: string, index: number) => {
      console.log("port", team);
      console.log("index", index);

      // setFocused(false);
      // const newData = [...portfolios];
      // const portFolioEditable = [
      //   ...newData?.filter((port) => port?.newPortfolio),
      // ];
      // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // // @ts-expect-error
      // if (portFolioEditable[0]?.teams?.includes(port)) {
      //   setDuplicates(true);
      //   port = false;
      //   toast.error("You cannot enter duplicate fields!!");
      //   setTimeout(() => setDuplicates(false), 3000);
      // }
      // if (portFolioEditable[0]) {
      //   const newPort = portFolioEditable[0]?.teams;
      //   newPort[+index] = port;
      //   setPortfolios(newData);
      // }
    },
    [portfolios]
  );

  // const addportFolio = useCallback(() => {
  //   setValue(portfolios?.length);
  //   setEditing(true);
  //   const newData = [...portfolios];
  //   newData.push({
  //     newPortfolio: true,
  //     teams: [false, false, false, false, false, false, false, false],
  //     championshipPoints: "",
  //   });
  //   setPortfolios(newData);
  // }, [portfolios]);

  const savePortfolio = useCallback(() => {
    if (!validTournament) {
      toast.error("The tournament has already started!!");
      return;
    }
    const newData = [...portfolios];
    const portFolioEditable = [
      ...newData?.filter((port) => port?.newPortfolio),
    ][0];
    const portfoliExist = portFolioEditable?.teams?.some((el) => el === false);

    if (portFolioEditable?.championshipPoints >= 1 && !portfoliExist) {
      const teamsId = portFolioEditable?.teams?.map((el) => {
        if (typeof el === "object") {
          return { id: el.id };
        }
      });
      sendPortfolio({
        championshipPoints: portFolioEditable?.championshipPoints,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        teamsId,
      });
      setChampionshipPoints("");
      setFocused(false);
      setError(false);
      setEditing(false);
    } else if (
      portFolioEditable?.championshipPoints >= 1 &&
      portFolioEditable?.teams?.some((el) => el === false)
    ) {
      setError(true);
      setTimeout(() => setError(false), 1000);
      toast.error("You must select all Teams!");
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
      toast.error("All fields are mandatory!!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolios]);

  const sendPortfolio = useCallback(
    (port: { championshipPoints: number; teamsId: [] }) => {
      const swalWithBootstrapButtons = Swal.mixin({});
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          confirmButtonColor: "#238b94",
          showCancelButton: true,
          confirmButtonText: "Yes, send it to!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const sendData = {
              port,
              portfolios,
              userId,
            };
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            mutate(sendData);
            try {
              swalWithBootstrapButtons.fire({
                title: "Saved!",
                text: "your portfolio has been saved.",
                icon: "success",
              });
            } catch {
              swalWithBootstrapButtons.fire({
                title: "Saved!",
                text: "an error has occurred.",
                icon: "error",
              });
            }
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire({
              title: "Cancelled",
              text: "Don't worry, you can still continue editing your portfolio :)",
              icon: "error",
            });
          }
        });
    },
    [portfolios, mutate, userId]
  );

  const removeportfolioFunction = useCallback(
    (portId: number) => {
      const index = portfolios.findIndex(
        (portfolio) => portfolio.id === portId
      );
      setValue(index);
      const swalWithBootstrapButtons = Swal.mixin({});
      swalWithBootstrapButtons
        .fire({
          title: `Are you sure to delete the portfolio ${portId}`,
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#238b94",
          confirmButtonText: "Yes, delete it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            setPortfolios(portfolios?.filter((el) => el?.id !== portId));
            const sendData = {
              portId,
              portfolios,
              userId,
            };
            await removeportfolioMutate(sendData);
            try {
              swalWithBootstrapButtons.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
              });
              if (index > 0) {
                setValue(index - 1);
              } else {
                setValue(index);
              }
            } catch {
              swalWithBootstrapButtons.fire({
                title: "Error!",
                text: "an error has occurred.",
                icon: "error",
              });
            }
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire({
              title: "Cancelled",
              text: "Don't worry, you can still continue editing your portfolio :)",
              icon: "error",
            });
            setValue(index);
          }
        });
    },
    [portfolios, removeportfolioMutate, userId]
  );

  const cancelPortfolio = useCallback(() => {
    const swalWithBootstrapButtons = Swal.mixin({});
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          if (value >= 1) {
            setValue(0);
          }
          setPortfolios(portfoliosObtained);
          setEditing(false);
          try {
            swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          } catch {
            swalWithBootstrapButtons.fire({
              title: "Error!",
              text: "an error has occurred.",
              icon: "error",
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Don't worry, you can still continue editing your portfolio :)",
            icon: "error",
          });
        }
      });
  }, [portfoliosObtained, value]);

  const options = [
    { value: "sunderland", label: "SUNDERLAND", icon: <SportsSoccerIcon /> },
    { value: "tottenham", label: "TOTTENHAM", icon: <SportsBasketballIcon /> },
    {
      value: "manchester-city",
      label: "MANCHESTER CITY",
      icon: <SportsSoccerIcon />,
    },
    {
      value: "west-ham-united",
      label: "WEST HAM UNITED",
      icon: <SportsBasketballIcon />,
    },
    {
      value: "aston-villa",
      label: "ASTON VILLA",
      icon: <SportsSoccerIcon />,
    },
  ];
  const [selected, setSelected] = useState("");

  const renderTeams = () => {
    return [0, 1, 2, 3, 4, 5, 6, 7].map((idx) => (
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
          shrink={selected !== ""} // El label solo se muestra si no hay selección
          sx={{
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            transition: "opacity 0.2s",
            opacity: selected ? 0 : 1, // Oculta visualmente el label si hay selección
          }}
        >
          Team
        </InputLabel>
        <Select
          labelId={`select-label-${idx}`}
          value={selected}
          label="Team"
          // onChange={(e) => setSelected(e.target.value)}
          onChange={(e) => handleChangeSelect(e.target.value, idx)}
          sx={{
            "& .MuiSelect-icon": {
              color: "white",
            },
          }}
        >
          {options.map((opt) => (
            <MenuItem
              key={opt.value}
              value={opt.value}
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
                  {opt.icon}
                </ListItemIcon>
                <ListItemText>{opt.label}</ListItemText>
              </div>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    ));
  };

  if (isLoading) return <Loader />;

  if ((portfolios, portfoliosObtained))
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
                    {" Name"}
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
                {renderTeams()}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
};

export default memo(MyPortfolioEPL);
