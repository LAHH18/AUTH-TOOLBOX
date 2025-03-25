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
app.get('/api/health', (_req, res) =>
  res.status(200).json({ status: 'OK' })
);

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouters);
app.use("/api", productsRouter);
app.use("/api", ventRouter);
app.use("/api", datosEmpRouter);
app.use("/api", favoritosRoutes);
app.use("/api", sincro);

app.get("/favicon.ico", (_req, res) => res.status(204).end());
app.get("/", (_req, res) => res.status(200).json({ message: "API running" }));

app.all("*", (_req, res) =>
  res.status(404).json({ error: "Not Found", path: _req.originalUrl })
);

export default app;
