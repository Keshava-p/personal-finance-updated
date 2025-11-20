// utils/sendEmail.js
import nodemailer from "nodemailer";

const sendEmail = async (to, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,   // Gmail Address
        pass: process.env.EMAIL_PASSWORD,   // Gmail App Password
      },
    });

    const mailOptions = {
      from: `"FinanceHub" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📨 Email sent successfully:", info.response);
    return true;
  } catch (error) {
    console.error("❌ Email sending error:", error.message);
    throw new Error("Email could not be sent");
  }
};

export default sendEmail;
