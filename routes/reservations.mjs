import { Router } from "express";
import { authorize } from "../middleware/auth.mjs";

const router = Router();

router.get("/", authorize, (req, res) => {
  res.send({ message: "Here your reservations." });
});

export default router;
