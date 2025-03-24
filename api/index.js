import serverless from 'serverless-http';
import app from '../src/app.js';
import mongoose from 'mongoose';

let isConnected = false;

const handler = async (req, res) => {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('✅ MongoDB conectado (reuse)');
  }
  return app(req, res);
};

export default serverless(handler);
