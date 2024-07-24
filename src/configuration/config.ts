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

export const URI_DB_MONGO = validateEnv("URI_DB_MONGO");
export const SECRET_KEY = validateEnv("SECRET_KEY");
export const SECRET_IV = validateEnv("SECRET_IV");
export const TOKEN_SECRET = validateEnv("TOKEN_SECRET");
export const BREVO_API_KEY = validateEnv("BREVO_API_KEY");
