import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

type Props = {
  setSelectedOrderBy: (value: string) => void;
  selectedOrderBy: string;
};

export default function ControlledRadioButtonsGroup({
  setSelectedOrderBy,
  selectedOrderBy,
}: Props) {
  const [value, setValue] = React.useState(selectedOrderBy);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event?.target?.value);
    setSelectedOrderBy(event?.target?.value);
  };

  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel
          value="1"
          control={
            <Radio
              sx={{
                color: "#df2af9",
                "&.Mui-checked": {
                  color: "#df2af9",
                },
              }}
            />
          }
          label="Score (Desc)"
        />
        <FormControlLabel
          value="2"
          control={
            <Radio
              sx={{
                color: "#df2af9",
                "&.Mui-checked": {
                  color: "#df2af9",
                },
              }}
            />
          }
          label="Portfolio (Asc)"
        />
        <FormControlLabel
          value="3"
          control={
            <Radio
              sx={{
                color: "#df2af9",
                "&.Mui-checked": {
                  color: "#df2af9",
                },
              }}
            />
          }
          label="Weight (Desc)"
        />
        <FormControlLabel
          value="4"
          control={
            <Radio
              sx={{
                color: "#df2af9",
                "&.Mui-checked": {
                  color: "#df2af9",
                },
              }}
            />
          }
          label="Weight (Asc)"
        />
      </RadioGroup>
    </FormControl>
  );
}
