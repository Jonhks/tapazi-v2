import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

type Props = {
  setSelectedOrderBy: (value: string) => void;
  selectedOrderBy: string;
  /** Radio button accent color. Defaults to ncaa-male green. */
  accentColor?: string;
};

const labels = [
  { value: "1", label: "Score (Desc)" },
  { value: "2", label: "Portfolio (Asc)" },
  { value: "3", label: "Weight (Desc)" },
  { value: "4", label: "Weight (Asc)" },
];

export default function ControlledRadioButtonsGroup({
  setSelectedOrderBy,
  selectedOrderBy,
  accentColor = "#05fa05",
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
        {labels.map(({ value: v, label }) => (
          <FormControlLabel
            key={v}
            value={v}
            control={
              <Radio
                sx={{
                  color: accentColor,
                  "&.Mui-checked": { color: accentColor },
                }}
              />
            }
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
