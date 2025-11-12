import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import reportRoutes from "./routes/report.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/reports", reportRoutes);

// connect db & start server
const PORT = process.env.PORT || 8000;
connectDB().then(() =>
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
);
