import { Router } from "express";
import { agregarFavorito, eliminarFavorito, obtenerFavoritos,
    agregarCarrito, eliminarCarrito, obtenerCarrito,
    agregarMensaje, obtenerMensaje
 } from "../controllers/favoritos.controller.js";
import { authRequiered } from '../middlewares/validateToken.js';
import {crearOrden, obtenerOrdenes, obtenerTodasLasVentas, actualizarEstadoVenta} from "../controllers/sales.controller.js"

const router = Router();

//Para Favoritos
router.post("/agregarFav",authRequiered, agregarFavorito);
router.delete("/eliminarFav", authRequiered, eliminarFavorito);
router.get("/userFav/:email", authRequiered, obtenerFavoritos);

//Para carrito
router.post("/agregarCar", authRequiered, agregarCarrito);
router.delete("/eliminarCar", authRequiered, eliminarCarrito);
router.get("/userCar/:email", authRequiered, obtenerCarrito);

//Contacto
router.post("/postContacto", agregarMensaje);
router.get("/getContacto", obtenerMensaje)

//Ordenes-Ventas
// Crear una orden
router.post("/crearOrden", authRequiered, crearOrden);
// Obtener órdenes de un usuario
router.get("/ordenes/:email", authRequiered, obtenerOrdenes);
// Obtener todas las ventas
router.get("/ventas", authRequiered, obtenerTodasLasVentas);

router.put("/ventas/:id/estado", actualizarEstadoVenta); // Ruta para actualizar el estado

export default router;
