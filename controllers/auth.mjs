import User from "../schemas/user.mjs";
import crypto from "crypto";
import { hashPassword } from "../utils/bcrypt.mjs";
import { transporter } from "../utils/mail.mjs";
import Box from "../schemas/box.js";

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const alreadyExists = await User.findOne({ email });

    if (alreadyExists) {
      return res
        .status(400)
        .json({ message: "User with email already exists" });
    }
    const newBox = new Box();

    const newUser = new User({
      name,
      email,
      password: hashPassword(password),
      box: newBox,
    });
    newUser.box.user = newUser;

    await newBox.save();
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

const login = async (req, res) => {
  const user = req.user.toObject();
  delete user.password;
  delete user.forgotPasswordToken;
  delete user.forgotPasswordTokenExpires;
  res.send({ message: "Login successful", user });
};

const currentUser = async (req, res) => {
  res.json({ user: req.user });
};

const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json({ message: "Logged out successfully" });
  });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.forgotPasswordToken = token;
    user.forgotPasswordTokenExpires = Date.now() + 1000 * 60 * 15;

    await user.save();

    await transporter.sendMail({
      from: '"Passport auth 👻" <hasanaliaa@code.edu.az>', // sender address
      to: user.email, // list of receivers
      subject: "Reset your password", // Subject line
      html: `
              <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .email-container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .email-header {
              text-align: center;
              margin-bottom: 20px;
            }
            .email-header h1 {
              color: #333;
            }
            .email-body {
              font-size: 16px;
              color: #555;
              line-height: 1.6;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              margin: 20px 0;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              font-size: 16px;
            }
            .footer {
              font-size: 14px;
              text-align: center;
              color: #777;
              margin-top: 30px;
            }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Password Reset Request</h1>
          </div>

          <div class="email-body">
            <p>Hi, ${user.name}</p>
            <p>We received a request to reset your password. You can reset your password by clicking the link below:</p>
            <a href="http://hasanali.site/reset-password/${token}" class="button">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email.</p>
          </div>

          <div class="footer">
            <p>Best regards,</p>
            <p>The Passport Auth Team</p>
          </div>
        </div>

      </body>
      </html>
      `,
    });

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = hashPassword(password);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

const authController = {
  register,
  login,
  currentUser,
  logout,
  forgotPassword,
  resetPassword,
};

export default authController;
