import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../controllers/task.controller";

const router: Router = Router();

router.post("/", verifyJWT, createTask);
router.get("/", verifyJWT, getAllTasks);
router.get("/:id", verifyJWT, getTaskById);
router.put("/:id", verifyJWT, updateTask);
router.delete("/:id", verifyJWT, deleteTask);

export default router;
