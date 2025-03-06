import { Router } from "express";
import { RegionController } from "../controllers/regionController";

const router = Router();

router.post("/", RegionController.create);
router.get("/", RegionController.findAll);
router.get("/:id", RegionController.findById);
router.delete("/:id", RegionController.delete);

export default router;
