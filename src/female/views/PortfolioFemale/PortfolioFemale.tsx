// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unsafe-optional-chaining */

import React, { useCallback, useEffect, useState, memo } from "react";
import { Box, Tabs, Tab, Button, Input, InputAdornment, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./PortfolioFemale.module.css";
import { BasquetIcon, BallIcon } from "@/assets/icons/icons";
import Dropdown from "../../components/Inputs/Dropdown";
import Loader from "../../components/BallLoader/BallLoader";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { usePortfolioFemaleData } from "@/hooks/usePortfolioFemaleData";
import { usePortfolioFemaleActions } from "@/hooks/usePortfolioFemaleActions";
import { getTournamentFemale } from "@/api/female/HomeAPIFemale";
import { Portfolios } from "@/types/index";

const MyPortfolio = () => {
  const params = useParams();
  const userId = params.userId!;
  const queryClient = useQueryClient();

  // Estados locales para la UI
  const [value, setValue] = React.useState(0);
  const [portfolios, setPortfolios] = useState<Portfolios>([]);
  const [error, setError] = useState(false);
  const [editing, setEditing] = useState(false);
  const [duplicates, setDuplicates] = useState(false);
  const [focused, setFocused] = useState(false);
  const [championshipPoints, setChampionshipPoints] = useState("");
  const [winnerSelected, setWinnerSelected] = useState(false);

  // Hook para obtener datos (Torneo, Portafolios, Equipos, Validaciones)
  const {
    currentTournamentFemale,
    portfoliosObtained,
    teamsFemale,
    isValidTournament,
    winnerTeamValidation,
    isLoading,
  } = usePortfolioFemaleData(userId);

  // Hook para manejar acciones (Guardar, Eliminar, Agregar, Cancelar)
  const {
    addportFolio,
    savePortfolio,
    removeportfolioFunction,
    cancelPortfolio,
  } = usePortfolioFemaleActions({
    userId,
    portfolios,
    setPortfolios,
    setValue,
    setEditing,
    setChampionshipPoints,
    setFocused,
    setError,
    isValidTournament,
    currentTournamentFemale,
    queryClient,
  });

  // Sincronizar puntos de campeonato cuando cambia el portafolio seleccionado
  useEffect(() => {
    if (portfolios) {
      setChampionshipPoints(portfolios[value]?.points || portfolios[value]?.championshipPoints || "");
    }
  }, [portfolios, value]);

  // Sincronizar portafolios obtenidos de la API
  useEffect(() => {
    setPortfolios(portfoliosObtained);
  }, [portfoliosObtained]);

  // Validar combinaciones de equipos ganadores
  const checkCombination = (arr, arrIds) => {
    for (let i = 0; i < arrIds.length; i++) {
      for (let j = 0; j < arrIds.length; j++) {
        if (i !== j) {
          const winnerOfTeamId = arrIds[i];
          const teamId = arrIds[j];
          const exists = arr.some(
            (item) =>
              item.winnerOfTeam === winnerOfTeamId &&
              item.winnerOfTeamHasTeam.includes(teamId),
          );
          if (exists) {
            toast.error(
              "You cannot select a team that also belongs to the selection of a winner of team!!",
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
    if (portfolios?.[value]) {
      const arrIds = portfolios[value].teams
        .filter((t) => typeof t === "object")
        .map((port) => port.id);
      checkCombination(winnerTeamValidation, arrIds);
    }
  }, [winnerTeamValidation, portfolios, value]);

  // Manejadores de eventos de entrada (Inputs)
  const handleChange = useCallback((event, newValue) => {
    setValue(newValue);
  }, []);

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newValue = e.target.value;
    const regex = /^(?:[1-9][0-9]{0,2}|0)$/;
    if (!regex.test(newValue) && newValue !== "") {
      setChampionshipPoints("");
      return;
    }
    setChampionshipPoints(newValue);
    const newData = portfolios.map((el) => {
      if (el?.newPortfolio) {
        return {
          ...el,
          points: newValue === "" ? "" : +newValue,
        };
      } else {
        return el;
      }
    });
    setPortfolios(newData);
    setFocused(true);
  };

  const handleChangeSelect = useCallback(
    (port: boolean, index: string | number) => {
      setFocused(false);
      const newData = [...portfolios];
      const portFolioEditable = newData.find((port) => port?.newPortfolio);

      if (portFolioEditable?.teams?.some((t) => t?.id === port?.id)) {
        setDuplicates(true);
        toast.error("You cannot enter duplicate fields!!");
        setTimeout(() => setDuplicates(false), 3000);
        return;
      }

      if (portFolioEditable) {
        portFolioEditable.teams[+index] = port;
        setPortfolios(newData);
      }
    },
    [portfolios],
  );

  // Renderizado de equipos
  const renderTeams = (indexPortfolio) => {
    const currentPortfolio = portfolios[indexPortfolio];
    if (!currentPortfolio) return null;

    return currentPortfolio.teams.map((team, indexTeam) => (
      <div
        key={indexTeam}
        className={classes.containerDropdown}
      >
        <BallIcon />
        <Dropdown
          disabled={!!currentPortfolio.id}
          indexPortfolio={indexPortfolio}
          indexTeam={indexTeam}
          name={`${team}`}
          label={`Selection ${indexTeam + 1}`}
          value={typeof team === "object" ? team.name : ""}
          options={!!currentPortfolio.id ? currentPortfolio.teams : teamsFemale}
          handleChange={handleChangeSelect}
        />
      </div>
    ));
  };
  // console.log(portfolios);

  if (isLoading) return <Loader />;

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
            {/* Cabecera del Portafolio */}
            <div className={classes.headerPortfolio}>
              <div style={{ color: "#DC903B" }}>
                <BasquetIcon />
                <h2 style={{ color: "#df2af9", fontSize: "2.4rem" }}>
                  MY PORTFOLIO{portfolios?.length > 1 && "S"}{" "}
                 ({portfolios?.length > 0 && portfolios?.length})
                </h2>
              </div>
            </div>
            <div>
              <h2 style={{ color: "white", textAlign: "center" }}>
                Tournament: 
                <p>
                  {currentTournamentFemale?.name?.replace(/-/g, " ")}
                </p>
              </h2>
               <Divider
                  sx={{
                    borderColor: "white",
                    mb: 2,
                    width: "70%",
                    margin: "0 auto",
                  }}
                />
            </div>
            <Box>
              <Grid size={12}>
                <Box sx={{ width: "100%" }}>
                  {/* Botón para añadir nuevo portafolio */}
                  {portfolios?.length < 8  && (
                    <div className={classes.addPortFolio}>
                      <Button
                        variant="contained"
                        color="success"
                        disabled={editing}
                        onClick={addportFolio}
                      >
                        Add Portfolio
                      </Button>
                    </div>
                  )}

                  {/* Pestañas (Tabs) */}
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
                      sx={{
                        "& .MuiTabs-scrollButtons": {
                          color: "#df2af9",
                          "& svg": {
                            fontSize: "2rem",
                          },
                        },
                        "& .MuiTabs-scrollButtons.Mui-disabled": {
                          opacity: 0.3,
                        },
                      }}
                    >
                      {portfolios?.map((port, i) => (
                        <Tab
                          key={i}
                          label={port?.name || `New (Portfolio ${i + 1})`}
                          className={`${classes.tabComponent} ${
                            i === value && classes.activeTab
                          }`}
                        />
                      ))}
                    </Tabs>
                  </Box>

                  {/* Contenido de cada pestaña */}
                  {portfolios?.map((port, indexPortfolio) => (
                    <div
                      key={indexPortfolio}
                      hidden={value !== indexPortfolio}
                      role="tabpanel"
                    >
                      {value === indexPortfolio && (
                        <Box sx={{ p: 3 }}>
                          {renderTeams(indexPortfolio)}
                          
                          {/* Sección de Puntos y Errores */}
                          <Grid
                            container
                            display={"flex"}
                            justifyContent={"end"}
                          >
                            {error && (
                              <p className={classes.error}>All fields are mandatory!!</p>
                            )}
                            {duplicates && (
                              <p className={classes.error}>You cannot enter duplicate fields!!</p>
                            )}
                            {winnerSelected && (
                              <p className={classes.error}>
                                You cannot select a team that also belongs to the selection of a winner of team!!!
                              </p>
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

                          {/* Botones de Acción */}
                          <Grid
                            container
                            m={2}
                            justifyContent={"end"}
                            spacing={2}
                          >
                            {port?.id ? (
                              <Grid size={{ lg: 4, md: 4, xs: 12 }}>
                                {isValidTournament && (
                                  <Button
                                    variant="contained"
                                    color="warning"
                                    fullWidth
                                    className={classes.btnRemove}
                                    onClick={() => removeportfolioFunction(port.id)}
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
                                    fullWidth
                                    className={classes.btnSubmit}
                                    onClick={savePortfolio}
                                    disabled={winnerSelected}
                                  >
                                    Submit
                                  </Button>
                                </Grid>
                                <Grid size={{ lg: 4, md: 4, xs: 12 }}>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    className={classes.btnCancel}
                                    onClick={() => cancelPortfolio(portfoliosObtained)}
                                  >
                                    Cancel
                                  </Button>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </Box>
                      )}
                    </div>
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
