import React from "react";
import { Button } from "@mui/material";
import classes from "../../views/myPortfolio/MyPortfolioWorldCup.module.css";

interface AddPortfolioButtonWorldCupProps {
  canAdd: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const AddPortfolioButtonWorldCup: React.FC<AddPortfolioButtonWorldCupProps> = ({
  canAdd,
  isDisabled,
  onClick,
}) => {
  if (!canAdd) return null;

  return (
    <div className={classes.addPortFolio}>
      <Button
        variant="contained"
        disabled={isDisabled}
        onClick={onClick}
        sx={{
          backgroundColor: "#00E2F6",
          color: "#000",
          fontWeight: "bold",
          "&:hover": { backgroundColor: "#00b8c9" },
          "&.Mui-disabled": { backgroundColor: "#004d54", color: "#666" },
        }}
      >
        Add Portfolio
      </Button>
    </div>
  );
};

export default AddPortfolioButtonWorldCup;
