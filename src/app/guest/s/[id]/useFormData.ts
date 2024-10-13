import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import { FormData } from './interfaces';
import { validateEmail, validateName, validatePhone } from './validations';

export const useFormData = (inputs: any[]) => {
  const [formData, setFormData] = useState<FormData>(
    inputs.reduce(
      (acc, input) => ({
        ...acc,
        [input.label]: {
          label: input.label,
          value: input?.options?.[0] || "",
          type: input.type,
          error: "",
          errorMessage: "",
        },
      }),
      {} as FormData
    )
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let error = "";
    let errorMessage = "";

    if (name === "Email" && !validateEmail(value)) {
      error = "error";
      errorMessage = "Formato de email inválido";
    } else if ((name === "Nombres" || name === "Apellidos") && !validateName(value)) {
      error = "error";
      errorMessage = "Solo se permiten letras";
    } else if (name === "Teléfono Movil" && !validatePhone(value)) {
      error = "error";
      errorMessage = "Solo se permiten números";
    }

    setFormData((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        error,
        errorMessage,
      },
    }));
  };

  const handleChangeSelect = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value: value,
      },
    }));
  };

  return { formData, handleChange, handleChangeSelect };
};