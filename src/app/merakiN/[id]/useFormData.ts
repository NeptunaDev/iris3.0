import { useState, useCallback } from "react";
import { inputs } from "./data";
import { validateField } from "./validations";
import { FormData } from "./interfaces";

export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>(
    inputs.reduce(
      (acc, input) => ({
        ...acc,
        [input.label]: {
          label: input.label,
          type: input.type,
          value: "",
          error: "",
          errorMessage: input.errorMessage,
        },
      }),
      {} as FormData
    )
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const field = formData[name];
      const error = validateField(value, field.type);

      setFormData((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          value,
          error,
        },
      }));
    },
    [formData]
  );

  const handleChangeSelect = useCallback(
    (name: string, value: string) => {
      const field = formData[name];
      const error = validateField(value, field.type);

      setFormData((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          value,
          error,
        },
      }));
    },
    [formData]
  );

  return {
    formData,
    handleChange,
    handleChangeSelect,
  };
}; 