import { Router } from "express";
import { agregarSincronizacion, obtenerSincronizacionesPorEmail, eliminarSincronizacion,
    obtenerTodasLasSincronizaciones
 } from "../controllers/sincro.controller.js";
import { authRequiered } from "../middlewares/validateToken.js";

const router = Router();

// Ruta para agregar una nueva sincronización
router.post("/agregarSync", authRequiered, agregarSincronizacion);

// Ruta para obtener las sincronizaciones de un usuario (por email)
router.get("/userSync/:email", authRequiered, obtenerSincronizacionesPorEmail);

// Ruta para eliminar una sincronización (se envía email y código en el body)
router.delete("/eliminarSync", authRequiered, eliminarSincronizacion);

// Obtiene todas las sincronizaciones
router.get("/Sincronizaciones", authRequiered, obtenerTodasLasSincronizaciones);

export default router;