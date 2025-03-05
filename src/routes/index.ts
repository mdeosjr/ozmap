import { Router } from "express";
import usersRouter from "./userRoutes";

const router = Router();

router.use('/api/users', usersRouter);

router.get("/health", (req, res) => {
  res.status(200).send("OK");
});

export default router;
