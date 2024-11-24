const { Router } = require("express");
const router = Router();

const {
  postBox,
  getAllBoxes,
  getBoxById,
  deleteBox,
  addProductToBox,
  removeProductFromBox,
  updateBox,
} = require("../controllers/box");
const {
  validateBox,
  validateBoxUpdate,
  validateAddProductToBox,
  validateRemoveProductFromBox,
} = require("../validation/box");
const { authorize } = require("../middleware/auth.mjs");

router.get("/", getAllBoxes);

router.get("/:id", authorize({ isAdmin: true }), getBoxById);

router.put("/:id", validateBoxUpdate, updateBox);

router.post("/", authorize({ isAdmin: true }), validateBox, postBox);

router.post("/add/:productId", validateAddProductToBox, addProductToBox);

router.post(
  "/remove/:productId",
  validateRemoveProductFromBox,
  removeProductFromBox
);

router.delete("/:id", authorize({ isAdmin: true }), deleteBox);

module.exports = router;
