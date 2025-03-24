import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRouters from "./routes/auth.routes.js";
import productsRouter from "./routes/products.routes.js";
import ventRouter from "./routes/ventana.routes.js";
import datosEmpRouter from "./routes/empresa.routes.js";
import favoritosRoutes from "./routes/favoritos.routes.js";
import sincro from "./routes/sincro.routes.js";

const app = express();

// Health‑check rápido (no conecta a BD)
app.get('/api/health', (_req, res) => {
  return res.status(200).json({ status: 'OK' });
});

const allowedOrigins = ['http://localhost:5173', 'http://192.168.0.103:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    return allowedOrigins.includes(origin)
      ? callback(null, true)
      : callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Tus rutas bajo /api
app.use("/api", authRouters);
app.use("/api", productsRouter);
app.use("/api", ventRouter);
app.use("/api", datosEmpRouter);
app.use("/api", favoritosRoutes);
app.use("/api", sincro);

export default app;
