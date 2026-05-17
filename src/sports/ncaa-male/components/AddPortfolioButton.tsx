import React from "react";
import { Button } from "@mui/material";
import classes from "../views/myPortfolio/MyPortfolio.module.css";

interface AddPortfolioButtonProps {
  canAdd: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

const AddPortfolioButton: React.FC<AddPortfolioButtonProps> = ({
  canAdd,
  isDisabled,
  onClick,
}) => {
  if (!canAdd) return null;

  return (
    <div className={classes.addPortFolio}>
      <Button
        variant="contained"
        color="success"
        disabled={isDisabled}
        onClick={onClick}
      >
        Add Portfolio
      </Button>
    </div>
  );
};

export default AddPortfolioButton;
