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

const server = serverless(app);

export default async function handler(req, res) {
  await connectDB();
  return server(req, res);
}
