const Product = require("../schemas/product");
const Box = require("../schemas/box");
const { BASE_URL } = process.env;
const { validationResult } = require("express-validator");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    const updatedProducts = products.map((product) => ({
      ...product.toObject(),
      image: product.image ? `${BASE_URL}${product.image}` : null,
    }));
    res.json({
      total: updatedProducts.length,
      products: updatedProducts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({
      product: {
        ...product.toObject(),
        image: product.image ? `${BASE_URL}${product.image}` : null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const updates = {
      ...(name && { name }),
      ...(price && { price: parseFloat(price) }),
      ...(description && { description }),
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (price) {
      let boxes = await Box.find({
        items: {
          $elemMatch: {
            product: req.params.id,
          },
        },
      }).populate("items.product");

      if (boxes.length > 0) {
        for (const box of boxes) {
          let total = 0;

          for (const item of box.items) {
            total +=
              item.quantity *
              (item.product._id.equals(req.params.id)
                ? product.price
                : item.product.price);
          }

          const updatedPrice = total;

          box.price = updatedPrice;

          console.log("Box price before save:", box.price);

          await box.save();

          console.log("Box saved:", box);

          const updatedBox = await Box.findById(box._id);
          console.log("Updated box from DB:", updatedBox);
        }
      }
    }

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!req.file) {
      return res.status(400).json({ error: "Image is required." });
    }

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, price, description } = req.body;
    const product = new Product({
      name,
      price,
      description,
      image: req.file ? `${BASE_URL}${req.file.path}` : null,
    });

    await product.save();
    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct,
};
