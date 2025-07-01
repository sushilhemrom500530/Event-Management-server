import dotenv from "dotenv";
import User from "../models/user/index.js";
import { verifyToken } from "../helpers/jwtHelpers.js";
dotenv.config();

// export const AuthMiddleware = async (req, res, next) => {
//   try {
//     const token = req.headers.token;

//     if (!token) {
//       return res.status(401).json({ success: false, message: "No token provided" });
//     }

//     const decoded = verifyToken(token,process.env.JWT_SECRET_KEY );
//     // console.log("decode user is:", decoded);

//     const user = await User.findById(decoded?._id).select("-password");
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found!" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({ success: false, message: error?.message || "User unauthorized!" });
//   }
// };


export const AuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const token =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = verifyToken(token, process.env.JWT_SECRET_KEY);
    // console.log({decoded});

    const user = await User.findById(decoded?._id).select("-password");
      //  console.log({user});
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

 
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error?.message || "User unauthorized!",
    });
  }
};