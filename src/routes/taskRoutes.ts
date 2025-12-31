import { Router } from "express";
import {
  findAll,
  findById,
  remove,
  save,
  update,
} from "../controllers/taskController";
import authenticate from "../middleware/authenticate";

const router = Router();

router.get("/", authenticate, findAll);
router.get("/:taskId", authenticate, findById);
router.post("/", authenticate, save);
router.put("/:taskId", authenticate, update);
router.delete("/:taskId", authenticate, remove);

export default router;
