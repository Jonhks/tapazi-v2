import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

export default function ControlledRadioButtonsGroup({
  setSelectedOrderBy,
  selectedOrderBy,
}) {
  const [value, setValue] = React.useState(selectedOrderBy);

  const handleChange = (event) => {
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
                color: "white",
                "&.Mui-checked": {
                  color: "white",
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
                color: "white",
                "&.Mui-checked": {
                  color: "white",
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
                color: "white",
                "&.Mui-checked": {
                  color: "white",
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
                color: "white",
                "&.Mui-checked": {
                  color: "white",
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
