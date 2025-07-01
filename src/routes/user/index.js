import express from "express";
import catchAsync from "../../shared/catchAsync.js";
import { UserController } from "../../controller/user/index.js";
import { AuthMiddleware } from "../../middleware/auth.js";

const router = express.Router();

router.get(
  "/",
  // AuthMiddleware,
  catchAsync(UserController.GetAllFromDB)
);


router.get("/check", AuthMiddleware, UserController.CheckUser);


export const UserRoutes = router;
