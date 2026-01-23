import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import loggerMiddleware from "./middlewares/loggerMiddleware.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(loggerMiddleware);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use(errorHandler);

export default app;
