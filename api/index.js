import serverless from "serverless-http";
import app from "../src/app.js";
import mongoose from "mongoose";

let isConnected = false;
async function connectDB() {
  if (!isConnected && process.env.MONGODB_URI) {
    console.log("Intentando conectar a la DB...");
    console.log("MONGODB_URI =>", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("DB conectada");
  }
}

const server = serverless(app);

export default async function handler(req, res) {
  // Si es favicon o health, no te conectes a la DB:
  if (req.url === '/favicon.ico' || req.url === '/api/health') {
    return server(req, res);
  }
  // Para el resto, sí conectas:
  await connectDB();
  return server(req, res);
}

