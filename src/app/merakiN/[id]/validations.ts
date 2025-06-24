export const validateField = (value: string, type: string): string => {
  if (!value.trim()) {
    return "Este campo es requerido";
  }

  switch (type) {
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? "" : "Email inválido";
    case "tel":
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,}$/;
      return phoneRegex.test(value) ? "" : "Teléfono inválido";
    default:
      return value.length >= 2 ? "" : "Mínimo 2 caracteres";
  }
}; 