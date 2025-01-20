import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { SelectChangeEvent } from "@mui/material/Select";

type ChangeHandler = (event: SelectChangeEvent<unknown>) => void;

export default function BasicSelect({
  label,
  className,
  value,
  handleChange: handleChange,
  name,
  options,
}: {
  label: string;
  className: string;
  value: unknown;
  handleChange: ChangeHandler;
  name: string;
  options: { id: string; name: string }[] | undefined;
}) {
  return (
    <Box
      sx={{ width: "100%" }}
      className={className}
    >
      <FormControl
        variant="standard"
        fullWidth
      >
        <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
          name={name}
          // labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={value}
          label={label}
          onChange={handleChange}
        >
          {options?.map((option, index) => (
            <MenuItem
              key={index}
              id={option?.id}
              value={option?.name}
            >
              {option?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
