// api/index.js

import serverless from "serverless-http";
import app from "../src/app.js";
import mongoose from "mongoose";

let isConnected = false;

async function connectDB() {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("✅ MongoDB conectado (reuse)");
  }
}

const handler = serverless(app);

export default async function handlerFunction(req, res) {
  await connectDB();
  await handler(req, res);    // ← Aquí usamos await, no return
}
