// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unsafe-optional-chaining */

import React, { useCallback, useEffect, useState, memo } from "react";
import { Box, Tabs, Tab, Button, Input, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./MyPortfolio.module.css";
import { BasquetIcon, BallIcon } from "@/assets/icons/icons";
import Dropdown from "@/components/Inputs/Dropdown";
import Loader from "@/components/BallLoader/BallLoader";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
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

const MyPortfolio = () => {
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
    (port: boolean, index: string | number) => {
      setFocused(false);
      const newData = [...portfolios];
      const portFolioEditable = [
        ...newData?.filter((port) => port?.newPortfolio),
      ];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (portFolioEditable[0]?.teams?.includes(port)) {
        setDuplicates(true);
        port = false;
        toast.error("You cannot enter duplicate fields!!");
        setTimeout(() => setDuplicates(false), 3000);
      }
      if (portFolioEditable[0]) {
        const newPort = portFolioEditable[0]?.teams;
        newPort[+index] = port;
        setPortfolios(newData);
      }
    },
    [portfolios]
  );

  const addportFolio = useCallback(() => {
    setValue(portfolios?.length);
    setEditing(true);
    const newData = [...portfolios];
    newData.push({
      newPortfolio: true,
      teams: [false, false, false, false, false, false, false, false],
      championshipPoints: 0,
    });
    setPortfolios(newData);
  }, [portfolios]);

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

  const renderTeams = (indexPortfolio) => {
    return portfolios[indexPortfolio]?.teams.map((team, indexTeam) => (
      <div
        key={indexTeam}
        className={classes.containerDropdown}
      >
        <BallIcon />
        <Dropdown
          disabled={!!portfolios[indexPortfolio]?.id}
          indexPortfolio={indexPortfolio}
          indexTeam={indexTeam}
          name={`${team}`}
          label={`Selection ${indexTeam + 1}`}
          value={
            typeof team === "object" &&
            portfolios[indexPortfolio]?.teams[indexTeam]?.name
          }
          options={
            !!portfolios[indexPortfolio]?.id
              ? portfolios[indexPortfolio]?.teams
              : teams
          }
          handleChange={handleChangeSelect}
        />
      </div>
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
          <Grid size={{ xs: 12, sm: 10, lg: 6 }}>
            <Box
              component="section"
              className={classes.boxPortfolio}
              m={3}
            >
              <div className={classes.headerPortfolio}>
                <div>
                  <BasquetIcon />
                  <h2 style={{ color: "white", fontSize: "2.4rem" }}>
                    Portfolio{portfolios?.length > 1 && "s"}:{" "}
                    {portfolios?.length > 0 && portfolios?.length}
                  </h2>
                </div>
              </div>
              <Box>
                <Grid size={12}>
                  <Box sx={{ width: "100%" }}>
                    {portfolios?.length < 8 && validTournament && (
                      <div className={classes.addPortFolio}>
                        <Button
                          variant="contained"
                          color="success"
                          disabled={editing}
                          onClick={() => addportFolio()}
                        >
                          Add Portfolio
                        </Button>
                      </div>
                    )}
                    <Box
                      sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                        indicatorColor="primary"
                      >
                        {portfolios?.map((port, i) => (
                          <Tab
                            key={i}
                            label={port?.name || `New (Portfolio ${i + 1})`}
                            {...a11yProps(i + 1)}
                            className={`${classes.tabComponent} ${
                              i === value && classes.activeTab
                            }`}
                          />
                        ))}
                      </Tabs>
                    </Box>
                    {portfolios?.map((port, indexPortfolio) => (
                      <CustomTabPanel
                        index={indexPortfolio}
                        key={indexPortfolio}
                        value={value}
                      >
                        {renderTeams(indexPortfolio)}
                        <Grid
                          container
                          display={"flex"}
                          justifyContent={"end"}
                        >
                          {error && (
                            <div>
                              <p className={classes.error}>
                                All fields are mandatory!!
                              </p>
                            </div>
                          )}
                          {duplicates && (
                            <div>
                              <p className={classes.error}>
                                You cannot enter duplicate fields!!
                              </p>
                            </div>
                          )}
                          {winnerSelected && (
                            <div>
                              <p className={classes.error}>
                                You cannot select a team that also belongs to
                                the selection of a winner of team!!!
                              </p>
                            </div>
                          )}
                          <Grid
                            display={"flex"}
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <Input
                              required
                              type="text"
                              autoFocus={focused}
                              value={championshipPoints}
                              sx={{ width: "80%", m: 1 }}
                              id="input-with-icon-adornment"
                              name="championshipPoints"
                              readOnly={!!port?.id}
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
                            />
                          </Grid>
                        </Grid>
                        <Grid
                          container
                          m={2}
                          justifyContent={"end"}
                        >
                          {!!port?.id ? (
                            <Grid size={{ lg: 4, md: 4, xs: 12 }}>
                              {validTournament && (
                                <Button
                                  variant="contained"
                                  color="warning"
                                  className={classes.btnRemove}
                                  onClick={() => {
                                    if (value >= 1) {
                                      setValue(0);
                                    }
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    removeportfolioFunction(port?.id);
                                  }}
                                >
                                  Remove
                                </Button>
                              )}
                            </Grid>
                          ) : (
                            <>
                              <Grid size={{ lg: 4, md: 4, xs: 12 }}>
                                <Button
                                  variant="contained"
                                  color="success"
                                  className={classes.btnSubmit}
                                  onClick={() => savePortfolio()}
                                  disabled={winnerSelected}
                                >
                                  Submit
                                </Button>
                              </Grid>
                              <Grid size={{ lg: 4, md: 4, xs: 12 }}>
                                <Button
                                  variant="contained"
                                  color="error"
                                  className={classes.btnCancel}
                                  onClick={() => cancelPortfolio()}
                                >
                                  Cancel
                                </Button>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </CustomTabPanel>
                    ))}
                  </Box>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    );
};

export default memo(MyPortfolio);
