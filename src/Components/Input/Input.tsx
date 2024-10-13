import { FormControl, FormLabel, SxProps, TextField } from "@mui/material";

interface InputProps {
  label: string;
  type: string;
  value: string;
  placeholder?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sx?: SxProps;
  error?: boolean;
  errorMessage?: string;
}

export function Input({
  label,
  type,
  placeholder,
  handleChange,
  value,
  sx,
  error,
  errorMessage
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
        error={error}
        helperText={error ? errorMessage : ""}
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
          ...sx
        }}
      />
    </FormControl>
  );
}