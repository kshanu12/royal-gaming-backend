import { getUser } from "../service/auth.js";

export default async function verifyToken(req, res, next) {
  console.log("inside verifyToken");
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const user = getUser(token);
  if (!user) return res.status(200).json("logged out");

  req.user = user;
  next();
}
