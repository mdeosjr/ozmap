import { Router } from "express";
import { RegionController } from "../controllers/regionController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { SchemaValidation } from "../middlewares/validateSchema";
import { createRegionSchema } from "../schemas/RegionInput";

const router = Router();

router.use(AuthMiddleware.validate);

router.post(
  "/",
  SchemaValidation.validate(createRegionSchema),
  RegionController.create,
);
router.get("/", RegionController.find);
router.get("/:id", RegionController.findById);
router.delete("/:id", RegionController.delete);

export default router;
