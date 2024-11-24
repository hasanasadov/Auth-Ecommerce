const Box = require("./schemas/Box"); // Adjust the path as needed


const updateBoxPrices = require("../utils/updateBoxPrices"); // Adjust the path as needed

const updateProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    const updates = {
      ...(name && { name }),
      ...(price && { price: parseFloat(price) }),
      ...(description && { description }),
    };

    // Step 1: Update the product first
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Step 2: Update related boxes after product is updated
    if (price) {
      await updateBoxPrices(req.params.id, parseFloat(price));
    }

    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = updateProduct;
