import mongoose from "mongoose";

const MensajeSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    telefono:{
        type: String,
        required: true
    },
    mensaje: {
        type: String,
        required: true
    },
    fechaAgregado: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Mensajes", MensajeSchema,"mensajes");