import { Router } from "express";
import { UserController } from "../controllers/userController";
import { SchemaValidation } from "../middlewares/validateSchema";
import { createUserSchema } from "../schemas/UserInput";

const router = Router();

router.post(
  "/",
  SchemaValidation.validate(createUserSchema),
  UserController.create,
);
router.get("/", UserController.findAll);
router.get("/:id", UserController.findById);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.delete);

export default router;
