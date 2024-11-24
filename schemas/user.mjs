import mongoose from "mongoose";
import Box from "../schemas/box.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: {
    type: String,
    default: null,
  },
  forgotPasswordTokenExpires: {
    type: Date,
    default: null,
  },
  box: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Box",
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
