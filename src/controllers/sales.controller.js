// sales.controller.js
import Order from "../models/order.model.js";
import Carrito from "../models/carrito.model.js";
import User from "../models/user.model.js";
import Producto from "../models/poducts.model.js";

export const crearOrden = async (req, res) => {
    const { email } = req.body;

    try {
        // Buscar el usuario por su email
        const usuario = await User.findOne({ email });
        if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

        // Obtener los productos en el carrito del usuario
        const carrito = await Carrito.find({ usuario: usuario._id }).populate("producto");
        if (carrito.length === 0) return res.status(404).json({ message: "No hay productos en el carrito" });

        // Calcular el total y preparar los productos para la orden
        let total = 0;
        const productosOrden = carrito.map(item => {
            const subtotal = item.producto.precio * item.cantidad;
            total += subtotal;
            return {
                producto: item.producto._id,
                cantidad: item.cantidad,
                precio: item.producto.precio
            };
        });

        // Crear la orden
        const nuevaOrden = new Order({
            usuario: usuario._id,
            productos: productosOrden,
            total: total,
            estado: "pendiente"
        });

        await nuevaOrden.save();

        // Restar el stock de cada producto en la colección de productos
        for (const item of carrito) {
            const producto = await Producto.findById(item.producto._id);
            if (!producto) {
                console.error(`Producto no encontrado: ${item.producto._id}`);
                continue;
            }

            // Verificar si hay suficiente stock
            if (producto.stock < item.cantidad) {
                return res.status(400).json({ 
                    message: `No hay suficiente stock para el producto: ${producto.nombre}`,
                    producto: producto.nombre,
                    stockDisponible: producto.stock,
                    cantidadSolicitada: item.cantidad
                });
            }

            // Restar la cantidad del stock
            producto.stock -= item.cantidad;
            await producto.save();
        }

        // Vaciar el carrito después de crear la orden
        await Carrito.deleteMany({ usuario: usuario._id });

        res.json({ message: "Orden creada exitosamente", orden: nuevaOrden });
    } catch (error) {
        console.error("Error al crear la orden:", error);
        res.status(500).json({ message: "Error interno del servidor", error });
    }
};


// Obtener todas las órdenes de un usuario
export const obtenerOrdenes = async (req, res) => {
    const { email } = req.params;

    try {
        const usuario = await User.findOne({ email });
        if (!usuario) return res.status(404).json({ message: "Usuario no encontrado" });

        const ordenes = await Order.find({ usuario: usuario._id }).populate("productos.producto");
        if (ordenes.length === 0) return res.status(404).json({ message: "No hay órdenes para este usuario" });

        res.json(ordenes);
    } catch (error) {
        console.error("Error al obtener las órdenes:", error);
        res.status(500).json({ message: "Error interno del servidor", error });
    }
};

//Obtener ventas
// Obtener todas las ventas (órdenes)
export const obtenerTodasLasVentas = async (req, res) => {
    try {
        // Obtener todas las órdenes de la base de datos y poblar los datos del usuario y productos
        const ventas = await Order.find()
            .populate({
                path: "usuario", // Poblar el campo "usuario"
                select: "nombre email", // Seleccionar solo el nombre y el email del usuario
            })
            .populate({
                path: "productos.producto", // Poblar el campo "producto" dentro de "productos"
                select: "nombre precio", // Seleccionar solo el nombre y el precio del producto
            });

        if (ventas.length === 0) {
            return res.status(404).json({ message: "No hay ventas registradas" });
        }

        // Formatear la respuesta para incluir los nombres del cliente y productos
        const ventasFormateadas = ventas.map((venta) => ({
            _id: venta._id,
            cliente: venta.usuario.nombre, // Nombre del cliente
            emailCliente: venta.usuario.email, // Email del cliente
            productos: venta.productos.map((producto) => ({
                nombre: producto.producto.nombre, // Nombre del producto
                cantidad: producto.cantidad,
                precio: producto.precio,
            })),
            total: venta.total,
            estado: venta.estado,
            fecha: venta.fechaCreacion, // Si tienes un campo de fecha en el modelo
        }));

        res.json(ventasFormateadas);
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        res.status(500).json({ message: "Error interno del servidor", error });
    }
};


// Actualizar el estado de una venta
export const actualizarEstadoVenta = async (req, res) => {
    const { id } = req.params; // ID de la venta
    const { estado } = req.body; // Nuevo estado

    // Validar que el estado sea uno de los permitidos
    const estadosPermitidos = ["pendiente", "completado", "cancelado"];
    if (!estadosPermitidos.includes(estado)) {
        return res.status(400).json({ message: "Estado no válido" });
    }

    try {
        // Buscar la venta por ID y actualizar el estado
        const ventaActualizada = await Order.findByIdAndUpdate(
            id,
            { estado },
            { new: true } // Devuelve el documento actualizado
        );

        if (!ventaActualizada) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }

        res.json({ message: "Estado de la venta actualizado", venta: ventaActualizada });
    } catch (error) {
        console.error("Error al actualizar el estado de la venta:", error);
        res.status(500).json({ message: "Error interno del servidor", error });
    }
};