import express from "express";
import reportRoutes from "./routes/reportRoutes.ts";
import { errorHandler } from "./middleware/errorHandler.ts";

const app = express();
app.use(express.json());
app.use("/api/reports", reportRoutes);
app.get("/health", (_req, res) => res.json({ ok: true }));

// must be last
app.use(errorHandler);

app.listen(8000, () => console.log("Server running on port 8000"));
