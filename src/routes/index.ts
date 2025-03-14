import { Router } from "express";
import usersRouter from "./userRoutes";
import regionsRouter from "./regionRoutes";
import authRouter from "./authRoutes";
import docsRouter from "./docsRoutes";

const router = Router();

router.use("/api/auth", authRouter);
router.use("/api/users", usersRouter);
router.use("/api/regions", regionsRouter);
router.use("/api-docs", docsRouter);

router.get("/health", (req, res) => {
  res.status(200).send("OK");
});

export default router;
