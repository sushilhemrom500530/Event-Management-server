import jwt from "jsonwebtoken";


export const createToken = (data) => {
  const jwtSecret = process.env.JWT_SECRET_KEY;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET_KEY is not defined in .env");
  }

  return jwt.sign(data, jwtSecret, { expiresIn: "7d" });
};
export const verifyToken = (token,secretToken) => {
  const jwtSecret = secretToken;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET_KEY is not defined in .env");
  }

  return  jwt.verify(token, secretToken);
};
