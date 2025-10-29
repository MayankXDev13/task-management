import { Router } from "express";

const router: Router = Router();

import { registerUser, loginUser } from "../controllers/user.controller";

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
