import { Router } from "express";
import { UserController } from "../controllers/userController";
import { SchemaValidation } from "../middlewares/validateSchema";
import { createUserSchema } from "../schemas/UserInput";
import { AuthMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post(
  "/",
  SchemaValidation.validate(createUserSchema),
  UserController.create,
);

router.use(AuthMiddleware.validate);

router.get("/", UserController.findAll);
router.get("/me", UserController.findById);
router.put("/me", UserController.update);
router.delete("/me", UserController.delete);

export default router;
