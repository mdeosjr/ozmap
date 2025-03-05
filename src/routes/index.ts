import { Router } from "express";
import usersRouter from "./users.route";

const router = Router();

router.use(usersRouter);

export default router;