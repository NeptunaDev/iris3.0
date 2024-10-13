export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validateName = (name: string): boolean => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
  };
  
  export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d+$/;
    return phoneRegex.test(phone);
  };