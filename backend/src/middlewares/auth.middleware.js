import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const verifyjwt = async (req, res, next) => {
  const token =
    req.cookies.token ||
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  //console.log("Token from request:", token);
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    // console.log("Verifying token:", token);
    // console.log("JWT Secret:", process.env.ACCESS_TOKEN_SECRET);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //console.log("Decoded token:", decoded);
    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken",
    );
    // console.log("User from DB:", user);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    req.user = user;
    // console.log("Authenticated user:", user);
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." });
    }
    return res.status(401).json({ error: "Invalid token." });
  }
};

export default verifyjwt;
