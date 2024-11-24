const { Router } = require("express");
const router = Router();

const multer = require("multer");
const path = require("path");

const {
  validateProduct,
  validateProductUpdate,
  validateDeleteProduct,
  validatePagination,
} = require("../validation/product");
const {
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct,
} = require("../controllers/product");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

router.post("/", upload.single("image"), validateProduct, createProduct);

router.get("/", validatePagination, getAllProducts);

router.get("/:id", getProductById);

router.put(
  "/:id",
  upload.single("image"),
  validateProductUpdate,
  updateProduct
);

router.delete("/:id", validateDeleteProduct, deleteProduct);

module.exports = router;
