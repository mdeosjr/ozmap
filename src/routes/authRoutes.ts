import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { SchemaValidation } from "../middlewares/validateSchema";
import { loginSchema } from "../schemas/AuthInput";

const authRouter = Router();

authRouter.post(
  "/login",
  SchemaValidation.validate(loginSchema),
  AuthController.login,
);

export default authRouter;
