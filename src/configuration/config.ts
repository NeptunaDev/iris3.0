const validateEnv = (name: string) => {
  try {
    const constant = process.env[name];
    if (!constant) throw new Error(`${name} is not defined in .env file`);
    return constant;
  } catch (error: any) {
    console.log(error.message);
    return "";
  }
};

export const URI_DB_MONGO = validateEnv("NEXT_PUBLIC_URI_DB_MONGO");
export const SECRET_KEY = validateEnv("NEXT_PUBLIC_SECRET_KEY");
export const SECRET_IV = validateEnv("NEXT_PUBLIC_SECRET_IV");
export const TOKEN_SECRET = validateEnv("NEXT_PUBLIC_TOKEN_SECRET");
export const BREVO_API_KEY = validateEnv("NEXT_PUBLIC_BREVO_API_KEY");
export const URI_API = validateEnv("NEXT_PUBLIC_URI_API") || "http://localhost:8001";
