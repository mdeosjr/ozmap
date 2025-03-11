import { Router } from "express";
import { RegionController } from "../controllers/regionController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { SchemaValidation } from "../middlewares/validateSchema";
import { createRegionSchema } from "../schemas/RegionInput";

const router = Router();

router.get("/", RegionController.findAll);
router.get("/by-point", RegionController.findByPoint);
router.get("/:id", RegionController.findById);

router.use(AuthMiddleware.validate);

router.get("/by-distance", RegionController.findByDistance);
router.post(
  "/",
  SchemaValidation.validate(createRegionSchema),
  RegionController.create,
);
router.patch("/:id", RegionController.update);
router.delete("/:id", RegionController.delete);

export default router;
