const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String },
  price: { type: Number },
  description: { type: String },
  image: { type: String },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
