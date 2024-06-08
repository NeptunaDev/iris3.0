import { FormControl, FormLabel, TextField } from "@mui/material";

interface InputProps {
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  label,
  type,
  placeholder,
  handleChange,
  value,
}: InputProps) {
  return (
    <FormControl>
      <FormLabel
        sx={{
          color: "#CCC",
        }}
        htmlFor={`id-${label}`}
      >
        {label}
      </FormLabel>
      <TextField
        name={label}
        onChange={handleChange}
        placeholder={placeholder || ""}
        type={type}
        id={`id-${label}`}
        variant="outlined"
        value={value}
        sx={{
          "& .MuiInputBase-colorPrimary": {
            color: "#CCC",
          },
          "& .Mui-focused": {
            color: "#000",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#CCC",
          },
        }}
      />
    </FormControl>
  );
}
