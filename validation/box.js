const { checkSchema } = require("express-validator");

const validateBox = checkSchema({
  items: {
    in: ["body"],
    optional: true,
    isArray: {
      errorMessage: "Items must be an array",
    },
    custom: {
      options: (value) => {
        if (!value || value.length === 0) {
          throw new Error("A box must contain at least one item");
        }
        return true;
      },
    },
  },
  "items.*.product": {
    in: ["body"],
    optional: true,
    isMongoId: {
      errorMessage: "Each item's product must be a valid MongoDB ObjectId",
    },
  },
  "items.*.quantity": {
    in: ["body"],
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "Quantity must be an integer and at least 1",
    },
  },
  price: {
    in: ["body"],
    optional: true,
    isFloat: {
      options: { min: 0 },
      errorMessage: "Price must be a positive number",
    },
    notEmpty: {
      errorMessage: "Price is required",
    },
  },
});

const validateBoxUpdate = checkSchema({
  name: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Name must be a string",
    },
    trim: true,
    notEmpty: {
      errorMessage: "Name cannot be empty",
    },
  },
  items: {
    in: ["body"],
    optional: true,
    isArray: {
      errorMessage: "Items must be an array",
    },
    custom: {
      options: (value) => {
        if (value && value.length === 0) {
          throw new Error("A box must contain at least one item");
        }
        return true;
      },
    },
  },
  "items.*.product": {
    in: ["body"],
    optional: true,
    isMongoId: {
      errorMessage: "Each item's product must be a valid MongoDB ObjectId",
    },
  },
  "items.*.quantity": {
    in: ["body"],
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "Quantity must be an integer and at least 1",
    },
  },
  price: {
    in: ["body"],
    optional: true,
    isFloat: {
      options: { min: 0 },
      errorMessage: "Price must be a positive number",
    },
  },
});

const validateAddProductToBox = checkSchema({
  productId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Invalid product ID",
    },
  },
  quantity: {
    in: ["body"],
    isInt: {
      options: { min: 1 },
      errorMessage: "Quantity must be a positive integer",
    },
  },
  "*": {
    in: ["body"],
    custom: {
      options: (value, { req }) => {
        const allowedFields = ["quantity"];
        const extraFields = Object.keys(req.body).filter(
          (key) => !allowedFields.includes(key)
        );
        if (extraFields.length > 0) {
          throw new Error(
            `Is not assignable to product: ${extraFields.join(", ")}`
          );
        }
        return true;
      },
    },
  },
});

const validateRemoveProductFromBox = checkSchema({
  productId: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Invalid product ID",
    },
  },
  quantity: {
    in: ["body"],
    isInt: {
      options: { min: 1 },
      errorMessage: "Quantity must be a positive integer",
    },
  },
  "*": {
    in: ["body"],
    custom: {
      options: (value, { req }) => {
        const allowedFields = ["quantity"];
        const extraFields = Object.keys(req.body).filter(
          (key) => !allowedFields.includes(key)
        );
        if (extraFields.length > 0) {
          throw new Error(
            `Is not assignable to product: ${extraFields.join(", ")}`
          );
        }
        return true;
      },
    },
  },
});

module.exports = {
  validateBox,
  validateBoxUpdate,
  validateAddProductToBox,
  validateRemoveProductFromBox,
};
