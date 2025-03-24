import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuarios",
        required: true
    },
    productos: [{
        producto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Productos",
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            min: 1
        },
        precio: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ["pendiente", "completado", "cancelado"],
        default: "pendiente"
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Ventas", orderSchema, "ventas");