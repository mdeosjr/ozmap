import { Router } from "express";
import { RegionController } from "../controllers/regionController";
import { AuthMiddleware } from "../middlewares/authMiddleware";
import { SchemaValidation } from "../middlewares/validateSchema";
import { createRegionSchema, updateRegionSchema } from "../schemas/RegionInput";

const router = Router();

router.get("/", RegionController.findAll);
router.get("/by-point", RegionController.findByPoint);
router.get("/:id([0-9a-fA-F]{24})", RegionController.findById);

router.use(AuthMiddleware.validate);

router.get("/by-distance", RegionController.findByDistance);
router.post(
  "/",
  SchemaValidation.validate(createRegionSchema),
  RegionController.create,
);
router.patch(
  "/:id([0-9a-fA-F]{24})",
  SchemaValidation.validate(updateRegionSchema),
  RegionController.update,
);
router.delete("/:id([0-9a-fA-F]{24})", RegionController.delete);

export default router;
