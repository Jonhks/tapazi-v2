import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import classes from "./Dropdown.module.css";
export default function SelectVariants({
  disabled,
  indexTeam,
  label,
  value,
  options,
  handleChange,
  name,
}: {
  disabled: boolean;
  indexTeam: number;
  label: string;
  value: string;
  options: Array<{ name: string }>;
  handleChange: (option: { name: string }, index: number) => void;
  name: string;
}) {
  return (
    <FormControl
      variant="standard"
      sx={{ m: 1, width: "100%" }}
      className={classes.formControl}
    >
      <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel>
      <Select
        name={name}
        labelId="demo-simple-select-standard-label"
        readOnly={disabled}
        value={value}
        onChange={(e) => {
          handleChange(
            options.filter((el) => el?.name === e?.target?.value)[0],
            indexTeam
          );
        }}
        label="Age"
      >
        {options?.map((option, index) => (
          <MenuItem
            key={index}
            value={option?.name}
          >
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
