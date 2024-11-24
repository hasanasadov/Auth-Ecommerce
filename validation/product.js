const { checkSchema } = require("express-validator");

const validateProduct = checkSchema({
  name: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Name is required.",
    },
    isString: {
      errorMessage: "Name must be a string.",
    },
    isLength: {
      options: { max: 100 },
      errorMessage: "Name cannot exceed 100 characters.",
    },
  },
  price: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Price is required.",
    },
    isFloat: {
      options: { gt: 0 },
      errorMessage: "Price must be a positive number.",
    },
  },
  description: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Description must be a string.",
    },
    isLength: {
      options: { max: 500 },
      errorMessage: "Description cannot exceed 500 characters.",
    },
  },
  image: {
    required: {
      errorMessage: "Image is required.",
    },
    custom: {
      options: (value, { req }) => {
        if (req.file && !req.file.mimetype.startsWith("image/")) {
          throw new Error("Uploaded file must be an image.");
        }
        return true;
      },
    },
  },
});

const validateProductUpdate = checkSchema({
  id: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Invalid product ID",
    },
  },
  name: {
    in: ["body"],
    optional: true,
    notEmpty: {
      errorMessage: "Product name cannot be empty",
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
  description: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Description must be a string",
    },
  },
});

const validateDeleteProduct = checkSchema({
  id: {
    in: ["params"],
    isMongoId: {
      errorMessage: "Invalid product ID",
    },
  },
});

const validatePagination = checkSchema({
  page: {
    in: ["query"],
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "Page must be a positive integer",
    },
  },
  limit: {
    in: ["query"],
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: "Limit must be a positive integer",
    },
  },
});

module.exports = {
  validateProduct,
  validateProductUpdate,
  validateDeleteProduct,
  validatePagination,
};
