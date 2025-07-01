import express from "express";
import validateAndParseBody from "../../middleware/validateAndParseBody.js";
import catchAsync from "../../shared/catchAsync.js";
import { EventController } from "../../controller/event/index.js";
import { EventValidation } from "../../validation/eventValidation.js";
import { AuthMiddleware } from "../../middleware/auth.js";

const router = express.Router();

router.get(
  "/",
  catchAsync(EventController.GetAllFromDB)
);

router.post(
  "/create",
  AuthMiddleware,
  validateAndParseBody(EventValidation.Create),
  catchAsync(EventController.InsertIntoDB)
);

router.put(
  "/update/:id",
  AuthMiddleware,
  catchAsync(EventController.UpdateIntoDB)
);

router.get(
  "/:id",
  catchAsync(EventController.UpdateIntoDB)
);

router.delete(
  "/delete/:id",
  AuthMiddleware,
  catchAsync(EventController.DeleteFromDB)
);
router.get(
  "/my-event/:id",
  AuthMiddleware,
  catchAsync(EventController.GetMyEvent)
);

router.post(
  "/:event_id/join",
  AuthMiddleware,
  catchAsync(EventController.JoinEvent)
);


export const EventRoutes = router;
