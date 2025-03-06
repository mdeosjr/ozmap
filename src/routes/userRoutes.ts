import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();

router.post("/", UserController.create);
router.get("/", UserController.findAll);
router.get("/:id", UserController.findById);
router.put("/:id", UserController.update);
router.delete("/:id", UserController.delete);

export default router;
