import { Router } from "express";
import usersRouter from "./userRoutes";
import regionsRouter from "./regionRoutes";
import authRouter from "./authRoutes";

const router = Router();

router.use("/api/auth", authRouter);
router.use("/api/users", usersRouter);
router.use("/api/regions", regionsRouter);

router.get("/health", (req, res) => {
  res.status(200).send("OK");
});

export default router;
