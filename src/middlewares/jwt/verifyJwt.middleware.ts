import { TOKEN_SECRET } from "@/configuration/config";
import { verify } from "jsonwebtoken";

export const verifyJwt = (req: Request) => {
  try {
    // Get token
    const authorization = req.headers.get("Authorization");
    if (!authorization) return new Error("Token not found");
    const token = authorization.split(" ")[1];

    // Verify token
    const jwt = verify(token, TOKEN_SECRET);
    return jwt;
  } catch (error) {
    if (error instanceof Error) {
      return new Error(error.message);
    }
  }
};
