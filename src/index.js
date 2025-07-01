import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import http from "http";
import { AuthRoutes } from "./routes/auth/index.js";
import globalErrorHandler from "./helpers/globalErrorHandler.js";
import { EventRoutes } from "./routes/event/index.js";
import { UserRoutes } from "./routes/user/index.js";

dotenv.config();

const port = process.env.PORT || 5000;
const url = process.env.DB_URL;

const app = express();
const server = http.createServer(app); 

// Middleware
app.use(express.json());
app.use(cors());



// Routes
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/event", EventRoutes);
app.use("/api/v1/user", UserRoutes);



// MongoDB Connection
async function main() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

main();


app.get("/api/v1", (req, res) => {
  res.send("Server is Running....");
});

// global error handler 
app.use(globalErrorHandler);

server.listen(port, () => {
  console.log(`Server Running on Port: ${port}`);
});


app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  res.status(404).json({
    message: "Route not found",
    path: fullUrl
  });
});

