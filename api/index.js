import serverless from 'serverless-http';
import app from '../src/app.js';
import { connectDB } from '../src/db.js';

connectDB();
export default serverless(app);
