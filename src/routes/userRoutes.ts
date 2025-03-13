import { Router } from "express";
import { UserController } from "../controllers/userController";
import { SchemaValidation } from "../middlewares/validateSchema";
import { createUserSchema, updateUserSchema } from "../schemas/UserInput";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/",
  SchemaValidation.validate(createUserSchema),
  UserController.create,
);
router.get("/", UserController.findAll);

router.use(AuthMiddleware.validate);

router.get("/me", UserController.findById);
router.patch(
  "/me",
  SchemaValidation.validate(updateUserSchema),
  UserController.update,
);
router.delete("/me", UserController.delete);

export default router;
