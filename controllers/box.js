const Product = require("../schemas/product");
const Box = require("../schemas/box");
const { validationResult } = require("express-validator");
const path = require("path");

const getAllBoxes = async (_, res) => {
  try {
    const boxes = await Box.find().populate("items.product");
    res.json({
      total: boxes.length,
      boxes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getBoxById = async (req, res) => {
  try {
    const box = await Box.findById(req.params.id).populate("items.product");
    if (!box) return res.status(404).json({ error: "Box not found" });
    res.json(box);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const postBox = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const box = new Box(req.body);
    await box.save();
    res.status(201).json({
      message: "Box created successfully",
      box,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateBox = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const box = await Box.findById(req.params.id).populate("items.product");
    if (!box) return res.status(404).json({ error: "Box not found" });

    box.price = parseFloat(box.price);
    if (isNaN(box.price)) {
      box.price = 0;
    }

    if (req.body.items) {
      console.log(req.body.items);
      box.items = req.body.items;
      box.price = 0; // Reset price to 0 before recalculating
      for (const item of box.items) {
        const product = await Product.findById(item.product);
        if (product && !isNaN(product.price) && item.quantity > 0) {
          box.price += product.price * item.quantity;
        } else {
          return res
            .status(400)
            .json({ error: "Invalid product price or quantity" });
        }
      }

      if (isNaN(box.price)) {
        box.price = 0; // Ensure price is valid
      }
    }

    box.populate("items.product");
    let errrrr;
    if (req.body.price !== undefined) {
      const actualPrice = box.items.reduce((acc, item) => {
        const product = item.product;
        return acc + (product ? Number(product.price) * item.quantity : 0);
      }, 0);
      box.price = actualPrice;
      errrrr = "You cannot update price manually";
      if (isNaN(box.price)) {
        box.price = 0;
      }
    }

    const updatedBox = await Box.findByIdAndUpdate(req.params.id, box, {
      new: true,
    });
    if (!updatedBox) {
      return res.status(404).json({ error: "Box not found" });
    }

    res.json({
      message: errrrr || "Box updated successfully",
      updatedBox,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

const deleteBox = async (req, res) => {
  try {
    const box = await Box.findByIdAndDelete(req.params.id);
    if (!box) return res.status(404).json({ error: "Box not found" });
    res.json({ message: "Box deleted successfully", box });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addProductToBox = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { productId } = req.params;
    const { quantity } = req.body;
    const box = await Box.findOne({ user: req.user.id });
    if (!box) return res.status(404).json({ error: "Box not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    let c = 0;
    box.items.map((item) => {
      if (item.product.toString() === productId) {
        item.quantity += quantity;
        c++;
      } else {
        item.quantity;
      }
    });

    if (c === 0) {
      box.items.push({ product: productId, quantity });
    }
    box.price = product.price * quantity + box.price;

    await box.save();
    res.json({
      message: "Product added to box successfully",
      box,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const removeProductFromBox = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { productId } = req.params;

    const box = await Box.findOne({ user: req.user.id });
    if (!box) return res.status(404).json({ error: "Box not found" });

    const itemIndex = box.items.findIndex(
      (item) => item.product.toString() === productId
    );

    console.log(itemIndex);

    if (itemIndex === -1)
      return res.status(404).json({ error: "Product not found in the box" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (box.items[itemIndex].quantity === req.body.quantity) {
      box.items.splice(itemIndex, 1);
    }
    if (req.body.quantity > box.items[itemIndex].quantity) {
      return res.status(400).json({
        error: "Quantity to remove is greater than the quantity in the box",
        box,
      });
    }
    if (box.items[itemIndex].quantity > 1) {
      box.items[itemIndex].quantity -= req.body.quantity;
    } else {
      box.items.splice(itemIndex, 1);
    }

    box.price = box.price - product.price * req.body.quantity;
    await box.save();

    res.json({
      message: "Product removed from box successfully",
      box,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllBoxes,
  getBoxById,
  postBox,
  updateBox,
  deleteBox,
  addProductToBox,
  removeProductFromBox,
};
