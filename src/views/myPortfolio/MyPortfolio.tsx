// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unsafe-optional-chaining */

import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab, Button, Input, InputAdornment } from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./MyPortfolio.module.css";
import { BasquetIcon, BallIcon } from "@/assets/icons/icons";
import Dropdown from "@/components/Inputs/Dropdown";
import Loader from "@/components/BallLoader/BallLoader";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  getPortfolios,
  getTeams,
  postNewPortfolio,
  removeportfolio,
} from "@/api/PortfoliosAPI";
import { Portfolios } from "@/types/index";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const MyPortfolio = () => {
  const params = useParams();
  const userId = params.userId!;

  const [value, setValue] = React.useState(0);
  const [portfolios, setPortfolios] = useState<Portfolios>([]);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [duplicates, setDuplicates] = useState(false);
  const [focused, setFocused] = useState(false);

  const { data: portfoliosObtained, isLoading } = useQuery({
    queryKey: ["portfolios", userId],
    queryFn: () => getPortfolios(userId),
  });

  const { data: teams } = useQuery({
    queryKey: ["teams", userId],
    queryFn: () => getTeams(),
  });

  const { mutate } = useMutation({
    mutationFn: postNewPortfolio,
    onSuccess: (resp) => {
      toast.success(resp);
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

  interface Team {
    name: string;
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

  const handleChangeSelect = (port: boolean, index: string | number) => {
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
  };

  const addportFolio = () => {
    setValue(portfolios?.length);
    setEditing(true);
    const newData = [...portfolios];
    newData.push({
      newPortfolio: true,
      teams: [false, false, false, false, false, false, false, false],
      championshipPoints: 0,
    });
    setPortfolios(newData);
  };

  const savePortfolio = () => {
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
  };

  // #238b94

  const sendPortfolio = (port: { championshipPoints: number; teamsId: [] }) => {
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
          console.log(port);
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
  };

  const removeportfolioFunction = (portId: number) => {
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
        }
      });
  };

  const cancelPortfolio = () => {
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
  };

  if (isLoading) return <Loader />;

  if ((portfolios, portfoliosObtained))
    return (
      <Grid
        size={12}
        sx={{
          minHeight: "700px",
          height: "calc(100vh - 54px)",
          overflow: "scroll",
        }}
      >
        <Grid
          container
          spacing={2}
          justifyContent={"center"}
          alignContent={"center"}
        >
          <Grid size={{ xs: 10, sm: 8, lg: 6 }}>
            <Box
              component="section"
              className={classes.boxPortfolio}
            >
              <div className={classes.headerPortfolio}>
                <div>
                  <BasquetIcon />
                  <h2>
                    Portfolio{portfolios?.length > 1 && "s"}:{" "}
                    {portfolios?.length > 0 && portfolios?.length}
                  </h2>
                </div>
                {/* <div>
                <PodiumIcon />
                <h4>Name Tournament</h4>
              </div> */}
              </div>
              <Box>
                <Grid size={12}>
                  <Box sx={{ width: "100%" }}>
                    {portfolios?.length < 8 && (
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
                        key={indexPortfolio}
                        value={value}
                        index={indexPortfolio}
                      >
                        {port.teams?.map(
                          (team: Team | boolean, indexTeam: number) => (
                            <div
                              key={indexTeam}
                              className={classes.containerDropdown}
                            >
                              <BallIcon />
                              <Dropdown
                                disabled={!!port?.id}
                                indexPortfolio={indexPortfolio}
                                indexTeam={indexTeam}
                                name={`${team}`}
                                // readOnly={!!port?.id}
                                label={`Selection ${indexTeam + 1}`}
                                value={
                                  typeof team === "object" &&
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore
                                  portfolios[indexPortfolio]?.teams[indexTeam]
                                    ?.name
                                }
                                options={!!port?.id ? port?.teams : teams}
                                handleChange={handleChangeSelect}
                              />
                            </div>
                          )
                        )}
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

                          <span>
                            <p>
                              <Input
                                required
                                type="text"
                                autoFocus={focused}
                                value={
                                  port?.championshipPoints >= 1
                                    ? port?.championshipPoints
                                    : ""
                                }
                                sx={{ width: "80%", m: 1 }}
                                id="input-with-icon-adornment"
                                name="championshipPoints"
                                readOnly={!!port?.id}
                                placeholder="Championship Points"
                                className={classes.championshipPoints}
                                startAdornment={
                                  <InputAdornment position="start">
                                    <EmojiEventsOutlinedIcon color="inherit" />
                                  </InputAdornment>
                                }
                                onChange={(e) => handleChangeInput(e)}
                              />
                            </p>
                          </span>
                        </Grid>
                        <Grid
                          container
                          m={2}
                          justifyContent={"end"}
                        >
                          {!!port?.id ? (
                            <Grid size={{ lg: 4, md: 4, xs: 12 }}>
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
                            </Grid>
                          ) : (
                            <>
                              <Grid size={{ lg: 4, md: 4, xs: 12 }}>
                                <Button
                                  variant="contained"
                                  color="success"
                                  className={classes.btnSubmit}
                                  onClick={() => savePortfolio()}
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

export default MyPortfolio;
