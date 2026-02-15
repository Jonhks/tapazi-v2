// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { postNewPortfolio, removeportfolio } from "@/api/female/PortfoliosAPI";

/**
 * Hook para manejar las acciones de los portafolios femeninos.
 */
export const usePortfolioFemaleActions = ({
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
}) => {
  // Mutación para crear un nuevo portafolio
  const { mutate } = useMutation({
    mutationFn: postNewPortfolio,
    onSuccess: (resp) => {
      toast.success(resp);
      queryClient.invalidateQueries(["portfoliosFEMALE", userId]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Mutación para eliminar un portafolio
  const { mutate: removeportfolioMutate } = useMutation({
    mutationFn: removeportfolio,
    onSuccess: (resp) => {
      toast.success(resp);
      queryClient.invalidateQueries(["portfoliosFEMALE", userId]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Agregar una nueva pestaña de portafolio
  const addportFolio = () => {
    setValue(portfolios?.length);
    setEditing(true);
    const newData = [...portfolios];
    newData.push({
      newPortfolio: true,
      teams: [false, false, false, false, false, false, false, false],
      points: "",
    });
    setPortfolios(newData);
  };

  // Guardar el portafolio actual
  const savePortfolio = async () => {
    if (!isValidTournament) {
      toast.error("The tournament has already started!!");
      return;
    }

    const portFolioEditable = [
      ...portfolios?.filter((p) => p?.newPortfolio),
    ][0];
    const portfoliExist = portFolioEditable?.teams?.some((el) => el === false);

    if (portFolioEditable?.points >= 1 && !portfoliExist) {
      const teamsId = portFolioEditable?.teams?.map((el) => {
        if (typeof el === "object") {
          return { id: el.id };
        }
      });

      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        confirmButtonColor: "#238b94",
        showCancelButton: true,
        confirmButtonText: "Yes, send it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        const sendData = {
          tournament_id: currentTournamentFemale?.id,
          participant_id: userId,
          championship_points: portFolioEditable.points,
          teams: teamsId.map((team) => ({
            ...team,
            seed: 0,
            streak_multiplier: 0,
          })),
        };

        mutate(sendData);
        setChampionshipPoints("");
        setFocused(false);
        setError(false);
        setEditing(false);

        await Swal.fire({
          title: "Saved!",
          text: "your portfolio has been saved.",
          icon: "success",
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "Cancelled",
          text: "Don't worry, you can still continue editing your portfolio :)",
          icon: "error",
        });
      }
    } else if (
      portFolioEditable?.points >= 1 &&
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

  // Eliminar un portafolio existente
  const removeportfolioFunction = async (portId: number) => {
    const index = portfolios.findIndex((p) => p.id === portId);
    setValue(index);

    const result = await Swal.fire({
      title: `Are you sure to delete the portfolio ${portId}`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#238b94",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      const updatedPortfolios = portfolios.filter((el) => el.id !== portId);
      setPortfolios(updatedPortfolios);

      const sendData = {
        portId,
        portfolios,
        userId,
      };

      await removeportfolioMutate(sendData);

      await Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });

      if (index > 0) {
        setValue(index - 1);
      } else {
        setValue(index);
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: "Cancelled",
        text: "Don't worry, you can still continue editing your portfolio :)",
        icon: "error",
      });
      setValue(index);
    }
  };

  // Cancelar la creación de un portafolio
  const cancelPortfolio = async (portfoliosObtained) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      setValue(0);
      setPortfolios(portfoliosObtained);
      setEditing(false);
      await Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success",
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: "Cancelled",
        text: "Don't worry, you can still continue editing your portfolio :)",
        icon: "error",
      });
    }
  };

  return {
    addportFolio,
    savePortfolio,
    removeportfolioFunction,
    cancelPortfolio,
  };
};
