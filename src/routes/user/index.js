import express from "express";
import catchAsync from "../../shared/catchAsync.js";
import { UserController } from "../../controller/user/index.js";

const router = express.Router();

router.get(
  "/",
  catchAsync(UserController.GetAllFromDB)
);


export const UserRoutes = router;
