// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unsafe-optional-chaining */

import React, { useCallback, useEffect, useState, memo } from "react";
import {
  Box,
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
import Loader from "@/epl/components/EPLBallLoader/EPLBallLoader";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Divider from "@mui/material/Divider";

import { getPortfolios } from "@/api/epl/PortfoliosEplAPI";
import {
  getTeams,
  getTeamsAvailable,
  postNewPortfolio,
} from "@/api/PortfoliosAPI";
import { Portfolios } from "@/types/index";
import { toast } from "react-toastify";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

const MyPortfolioEPL = () => {
  const params = useParams();
  const userId = params.userId!;
  const queryClient = useQueryClient();

  const [value, setValue] = React.useState(0);
  const [portfolios, setPortfolios] = useState<Portfolios>([]);
  const [portExist, setPortExist] = useState(false);

  const [championshipPoints, setChampionshipPoints] = useState("");
  const [validTournament, setValidTournament] = useState(false);

  const [selectedTeams, setSelectedTeams] = useState(Array(5).fill(""));

  useEffect(() => {
    if (portfolios) {
      setChampionshipPoints(portfolios[value]?.championshipPoints);
    }
  }, [portfolios, value]);

  const { data: portfoliosObtained, isLoadingPortfoliosObtained } = useQuery({
    queryKey: ["portfoliosEpl", userId],
    queryFn: () => getPortfolios(userId),
  });

  const { data: teamsEPL, isLoading } = useQuery({
    queryKey: ["teamsEpl", userId],
    queryFn: () => getTeams(2),
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });

  const { data: teamsEPLAvailable, isLoading: isLoadingTeamsEPLAvailable } =
    useQuery({
      queryKey: ["teamsEplAvailable", userId],
      queryFn: () => getTeamsAvailable(userId, 3),
      // cacheTime: 30 * 60 * 1000, // 30 minutes
      // refetchOnWindowFocus: false,
      refetchInterval: 60 * 1000, // Refetch cada minuto (60 segundos)
      // retry
    });

  // console.log(teamsEPL);
  console.log(teamsEPLAvailable);

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
      setPortExist(true);
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

  // ? Ya funciona, solo guarda los estados locales para los inputs. Guarda el nombre
  const handleChangeSelect = useCallback(
    (team: string, index: number) => {
      const newSelectedTeams = [...selectedTeams];
      newSelectedTeams[index] = team;
      setSelectedTeams(newSelectedTeams);
    },
    [selectedTeams]
  );

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
      tournament_id: "3",
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

    postNewPortfolioMutate({
      port: newPortfolio,
      userId: userId,
      portId: portfolios[0]?.id,
    });
  }, [selectedTeams, teamsEPL, userId, postNewPortfolioMutate, portfolios]);

  const renderTeams = () => {
    return [0, 1, 2, 3, 4].map((idx) => {
      // Opciones disponibles para este select (excluye las ya seleccionadas en otros selects)
      const availableOptions = teamsEPL?.filter(
        (opt) =>
          !selectedTeams.includes(opt.name) || selectedTeams[idx] === opt.name
      );
      const teamDetails = teamsEPL?.find(
        (team) => team.name === selectedTeams[idx]
      );
      // return (
      //   <FormControl
      //     key={idx}
      //     fullWidth
      //     sx={{
      //       backgroundColor: idx % 2 === 0 ? "#380f65" : "#200930",
      //       "& .MuiInputLabel-root": {
      //         color: "white",
      //         fontWeight: "bold",
      //         fontSize: "18px",
      //       },
      //     }}
      //   >
      //     <InputLabel
      //       id={`select-label-${idx}`}
      //       shrink={selectedTeams[idx] !== ""}
      //       sx={{
      //         color: "white",
      //         fontWeight: "bold",
      //         fontSize: "18px",
      //         transition: "opacity 0.2s",
      //         opacity: selectedTeams[idx] ? 0 : 1,
      //       }}
      //     >
      //       Team
      //     </InputLabel>
      //     <Select
      //       labelId={`select-label-${idx}`}
      //       value={selectedTeams[idx] ?? ""} // Usa "" si el valor es undefined
      //       label="Team"
      //       onChange={(e) => handleChangeSelect(e.target.value, idx)}
      //       sx={{
      //         "& .MuiSelect-icon": {
      //           color: "white",
      //         },
      //       }}
      //     >
      //       {availableOptions?.map((opt) => (
      //         <MenuItem
      //           key={opt.id}
      //           value={opt.name}
      //         >
      //           <div
      //             style={{
      //               display: "flex",
      //               flexDirection: "row",
      //               justifyContent: "center",
      //               alignItems: "center",
      //               color: "white",
      //               fontWeight: "bold",
      //               fontSize: "18px",
      //             }}
      //           >
      //             <ListItemIcon style={{ color: "white" }}>
      //               <img
      //                 src={opt.crest_url}
      //                 alt={opt.name}
      //                 style={{
      //                   width: 28,
      //                   height: 28,
      //                   objectFit: "contain",
      //                   marginRight: 8,
      //                 }}
      //               />
      //             </ListItemIcon>
      //             <ListItemText
      //               style={{ textAlign: "left", fontWeight: "bold" }}
      //             >
      //               {opt.name}
      //             </ListItemText>
      //           </div>
      //         </MenuItem>
      //       ))}
      //     </Select>
      //   </FormControl>
      // );
      return (
        <div
          key={idx}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          {/* Select */}
          <div
            style={{
              marginLeft: "20px",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {/* {teamDetails ? (
              <>
                <p>Seed: {teamDetails.seed}</p>
                <p>
                  Description: {teamDetails.description || "No description"}
                </p>
              </>
            ) : (
              <p style={{ fontStyle: "italic", color: "#aaa" }}>
                No team selected
              </p>
            )} */}
          </div>
          <FormControl
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
              value={selectedTeams[idx] ?? ""}
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

          {/* Team Details */}
          {/* <div
            style={{
              marginLeft: "20px",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {teamDetails ? (
              <>
                <p>Seed: {teamDetails.seed}</p>
                <p>
                  Description: {teamDetails.description || "No description"}
                </p>
              </>
            ) : (
              <p style={{ fontStyle: "italic", color: "#aaa" }}>
                No team selected
              </p>
            )}
          </div> */}
        </div>
      );
    });
  };

  if (isLoading || isLoadingPortfoliosObtained || isLoadingTeamsEPLAvailable) {
    return <Loader />;
  }

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
        <Grid size={{ xs: 12, sm: 10, lg: 8 }}>
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
                style={{ width: "80%", margin: "0 auto", textAlign: "right" }}
              >
                {renderTeams()}
              </div>
            </Grid>
            <Grid
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
                  {portExist ? "EDIT" : "SUBMIT"}
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
