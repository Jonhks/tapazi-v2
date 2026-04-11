import { ReactNode } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import classes from "./Dropdown.module.css";

export default function Dropdown({
  disabled,
  indexTeam,
  label,
  value,
  options,
  handleChange,
  name,
  menuBgColor = "rgba(0, 0, 0, 0.9)",
  icon,
}: {
  disabled: boolean;
  indexTeam: number;
  label: string;
  value: string;
  options: Array<{ name: string }>;
  handleChange: (option: { name: string }, index: number) => void;
  name: string;
  /** Color de fondo del menú desplegable. Por defecto: rgba(0,0,0,0.9) */
  menuBgColor?: string;
  /** Ícono opcional que aparece a la izquierda de cada opción (ej. BallIcon) */
  icon?: ReactNode;
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
            indexTeam,
          );
        }}
        label={label}
        renderValue={(selected) => selected as string}
        MenuProps={{
          slotProps: {
            paper: {
              className: "enable-vertical-scroll",
              sx: {
                backgroundColor: menuBgColor,
                color: "#fff",
              },
            },
          },
        }}
      >
        {options?.map((option, index) => (
          <MenuItem
            key={index}
            value={option?.name}
            sx={{ display: "flex", alignItems: "center", gap: icon ? 1 : 0 }}
          >
            {icon}
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
