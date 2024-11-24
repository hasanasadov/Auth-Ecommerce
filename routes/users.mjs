import { Router } from "express";
import { authorize } from "../middleware/auth.mjs";
import usersController from "../controllers/users.mjs";

const router = Router();

router.get("/", usersController.getAll);
router.post(
  "/:id/block",

  usersController.blockUser
);
router.post(
  "/:id/unblock",

  usersController.unblockUser
);
router.delete(
  "/:id",
  authorize({ isSuperAdmin: true }),
  usersController.remove
);

router.get("/:id", authorize(), usersController.changeRole);

export default router;
