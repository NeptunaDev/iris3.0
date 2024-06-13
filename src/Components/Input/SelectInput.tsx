import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface SelectInputProps {
  label: string;
  value: string;
  handleChange: (e: SelectChangeEvent<string>) => void;
  options: string[];
}

export function SelectInput({
  label,
  handleChange,
  value,
  options,
}: SelectInputProps) {
  return (
    <FormControl fullWidth>
      <FormLabel
        sx={{
          color: "#CCC",
        }}
        id={`id-${label}`}
      >
        {label}
      </FormLabel>
      <Select
        name={label}
        labelId={`id-${label}`}
        id={`id-${label}-select`}
        value={value}
        onChange={handleChange}
        sx={{
          "& .MuiSelect-select": {
            color: "#CCC",
          },
          "& .MuiSelect-icon": {
            color: "#CCC",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: '#000'
          },
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            value={option}
            sx={{
              "&.Mui-selected": {
                color: "#000",
              },
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
