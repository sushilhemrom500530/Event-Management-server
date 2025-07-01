import express from "express";
import { AuthController } from "../../controller/auth/index.js";
import catchAsync from "../../shared/catchAsync.js";
import { AuthValidation } from "../../validation/authValidation.js";
import { fileUploader } from "../../helpers/fileUploader.js";
import validateAndParseBody from "../../middleware/validateAndParseBody.js";
const router = express.Router();

router.post(
  "/signup",
  // fileUploader.upload.single("file"),
  validateAndParseBody(AuthValidation.SignUpSchema),
  catchAsync(AuthController.SignUp)
);

router.post(
  "/signin",
  validateAndParseBody(AuthValidation.SignInSchema),
  catchAsync(AuthController.SignIn)
);


export const AuthRoutes = router;
