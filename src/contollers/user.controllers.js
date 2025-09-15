import User from "../models/user.model.js";
import { uploadonCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
const generateAccessandRefreshToken = (user) => {
  try {
    const accessToken = user.generateAccessToken();
    user.accessToken = accessToken;
    //console.log("Access Token:", accessToken);
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });
    //console.log("Refresh Token:", refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
  }
};

const userRegister = async (req, res, next) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser)
      return res
        .status(400)
        .json({ error: "Email or Username already in use" });
    if (!req.files)
      return res
        .status(400)
        .json({ error: "Please upload a required picture" });
    //console.log("Files received:", req.files);
    const avatarLocalPath = req.files.avatar[0].path;
    // console.log("Avatar local path:", avatarLocalPath);
    if (!avatarLocalPath)
      return res.status(400).json({ error: "Avatar picture is required" });

    const cloudinaryResult = await uploadonCloudinary(avatarLocalPath);

    const user = new User({
      username,
      email,
      password,
      avatar: cloudinaryResult.secure_url,
    });
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();
    const usersuccess = await User.findOne({ email }).select(
      "-password -refreshToken"
    );
    if (usersuccess)
      return res
        .status(200)
        .json({ message: "User successfully created", user: usersuccess });
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ error: "Username and password are required" });

    const user = await User.findOne({ username });
    //console.log("User found:", user);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (!user.isPasswordCorrect(password))
      return res
        .status(401)
        .json({ error: "Incorrect password! Enter the correct password" });
    const { accessToken, refreshToken } = generateAccessandRefreshToken(user);
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json({
        message: "Login successful",
        accessToken,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { refreshToken: null },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json({ message: "Logged out successfully" });
};

const refreshAccessToken = async (req, res, next) => {
  const incomingrefreshToken = req.cookies.refreshToken;
  if (!incomingrefreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }
  try {
    jwt.verify(
      incomingrefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json({ error: "Invalid refresh token" });
        }
        const user = await User.findById(decoded._id);
        if (!user || user.refreshToken !== incomingrefreshToken) {
          return res.status(403).json({ error: "Invalid refresh token" });
        }
        const { newaccessToken, newrefreshToken } =
          generateAccessandRefreshToken(user);
        const options = {
          httpOnly: true,
          secure: true,
        };
        return res
          .status(200)
          .cookie("refreshToken", newrefreshToken, options)
          .cookie("accessToken", newaccessToken, options)
          .json({
            message: "Token refreshed successfully",
          });
      }
    );
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res
        .status(400)
        .json({ error: "Please provide both old and new passwords" });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isOldPasswordCorrect)
      return res.status(401).json({ error: "Old password is incorrect" });
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};
export { userRegister };
export { userLogin };
export { logout };
export { refreshAccessToken };
export { changePassword };
