// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import classes from "./MyPortfolio.module.css";
import { BasquetIcon } from "@/assets/icons/icons";
import Loader from "../../components/BallLoader/BallLoader";

// Hooks personalizados
import { usePortfolioData } from "../../../hooks/usePortfolioData";
import { usePortfolioActions } from "../../../hooks/usePortfolioActions";
import { usePortfolioValidation } from "../../../hooks/usePortfolioValidation";

// Componentes
import PortfolioTab from "../../components/PortfolioTab";
import AddPortfolioButton from "../../components/AddPortfolioButton";

const MyPortfolio = () => {
  const params = useParams();
  const userId = params.userId!;
  const queryClient = useQueryClient();

  // Estado principal
  const [activeTab, setActiveTab] = useState(0);
  const [portfolios, setPortfolios] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Cargar datos
  const {
    portfoliosData,
    teamsData,
    isLoading,
    isValidTournament,
    winnerTeamValidation,
  } = usePortfolioData(userId);

  // Acciones del portfolio
  const {
    handleAddPortfolio,
    handleSavePortfolio,
    handleRemovePortfolio,
    handleCancelPortfolio,
  } = usePortfolioActions({
    userId,
    portfolios,
    setPortfolios,
    setActiveTab,
    setIsEditing,
    isValidTournament,
    queryClient,
  });

  // Validaciones
  const { validateTeamSelection } =
    usePortfolioValidation(winnerTeamValidation);

  // Sincronizar portfolios cuando cambien los datos
  useEffect(() => {
    if (portfoliosData) {
      setPortfolios(portfoliosData);
    }
  }, [portfoliosData]);

  // Validar selección de equipos cuando cambie el portfolio activo
  useEffect(() => {
    if (portfolios[activeTab]) {
      const teamIds = portfolios[activeTab].teams
        .filter((team) => typeof team === "object" && team?.id)
        .map((team) => team.id);
      validateTeamSelection(teamIds);
    }
  }, [portfolios, activeTab, validateTeamSelection]);

  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTeamSelection = (teamData, teamIndex: number) => {
    const updatedPortfolios = portfolios.map((portfolio) => {
      if (portfolio.newPortfolio) {
        // Verificar duplicados
        if (portfolio.teams.some((team) => team?.id === teamData?.id)) {
          toast.error("You cannot enter duplicate fields!");
          return portfolio;
        }

        const updatedTeams = [...portfolio.teams];
        updatedTeams[teamIndex] = teamData;

        return {
          ...portfolio,
          teams: updatedTeams,
        };
      }
      return portfolio;
    });

    setPortfolios(updatedPortfolios);
  };

  const handleChampionshipPointsChange = (value: string) => {
    const regex = /^(?:[1-9][0-9]{0,2}|0)$/;

    if (value === "" || regex.test(value)) {
      const updatedPortfolios = portfolios.map((portfolio) => {
        if (portfolio.newPortfolio) {
          return {
            ...portfolio,
            championship_points: value,
          };
        }
        return portfolio;
      });

      setPortfolios(updatedPortfolios);
    }
  };

  if (isLoading) {
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
        justifyContent="center"
        alignContent="center"
      >
        <Grid size={{ xs: 12, sm: 10, lg: 6 }}>
          <Box
            component="section"
            className={classes.boxPortfolio}
            m={3}
          >
            {/* Header */}
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
                  {/* Botón para agregar portfolio */}
                  <AddPortfolioButton
                    canAdd={portfolios?.length < 8 && isValidTournament}
                    isDisabled={isEditing}
                    onClick={handleAddPortfolio}
                  />

                  {/* Tabs */}
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={activeTab}
                      onChange={handleTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      aria-label="portfolio tabs"
                      indicatorColor="primary"
                    >
                      {portfolios?.map((portfolio, index) => (
                        <Tab
                          key={index}
                          label={
                            portfolio?.name || `New (Portfolio ${index + 1})`
                          }
                          className={`${classes.tabComponent} ${
                            index === activeTab && classes.activeTab
                          }`}
                        />
                      ))}
                    </Tabs>
                  </Box>

                  {/* Contenido de los tabs */}
                  {portfolios?.map((portfolio, index) => (
                    <PortfolioTab
                      key={index}
                      portfolio={portfolio}
                      portfolioIndex={index}
                      isActive={activeTab === index}
                      teams={teamsData}
                      isValidTournament={isValidTournament}
                      onTeamSelect={handleTeamSelection}
                      onChampionshipPointsChange={
                        handleChampionshipPointsChange
                      }
                      onSave={handleSavePortfolio}
                      onRemove={handleRemovePortfolio}
                      onCancel={handleCancelPortfolio}
                    />
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
