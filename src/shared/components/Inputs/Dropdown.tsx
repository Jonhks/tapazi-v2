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
  disabledOptions = [],
}: {
  disabled: boolean;
  indexTeam: number;
  label: string;
  value: string;
  options: Array<{ name: string; crest_url?: string; [key: string]: any }>;
  handleChange: (option: any, index: number) => void;
  name: string;
  /** Color de fondo del menú desplegable. Por defecto: rgba(0,0,0,0.9) */
  menuBgColor?: string;
  /** Ícono opcional que aparece a la izquierda de cada opción (ej. BallIcon) */
  icon?: ReactNode;
  /** Arreglo de opciones (nombres) que deben estar deshabilitadas */
  disabledOptions?: string[];
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
            disabled={disabledOptions.includes(option?.name)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: icon || option?.crest_url ? 1 : 0,
            }}
          >
            {option?.crest_url ? (
              <img
                src={option.crest_url}
                alt={option.name}
                style={{ width: "24px", height: "24px", objectFit: "contain" }}
              />
            ) : (
              icon
            )}
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
