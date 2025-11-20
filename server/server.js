import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/salary", salaryRoutes);

// Test
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "API Working" });
});

// Connect DB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/personal_finance")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err.message));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running → http://localhost:${PORT}`)
);
