import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export default function BasicSelect({
  label,
  className,
  value,
  handleChange,
  name,
  options,
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
