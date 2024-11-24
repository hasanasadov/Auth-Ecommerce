import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "hasanaliaa@code.edu.az",
    pass: "ocsg fwqt xsil iwxa",
  },
});
