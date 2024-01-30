import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwt_secret = process.env.JWT_SECRET;

export function setUser(user) {
  const payload = {
    username: user.username,
  };
  const token = jsonwebtoken.sign(payload, jwt_secret, { expiresIn: "1.5d" });
  const decoded = jsonwebtoken.decode(token);
  return {
    token,
    tokenExpiry: decoded.exp * 1000,
  };
}

export function getUser(token) {
  console.log(token)
  if (!token) return null;
  try {
    return jsonwebtoken.verify(token, jwt_secret);
  } catch (e) {
    return null;
  }
}
