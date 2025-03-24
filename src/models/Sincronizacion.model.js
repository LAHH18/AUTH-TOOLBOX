import mongoose from "mongoose";

const sincronizacionSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuarios", // Nombre de la colección o modelo de usuario
    required: true
  },
  ventana: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ventana", // Nombre de la colección o modelo de ventana
    required: true,
    unique: true  // Impide que el mismo documento de ventana se sincronice con distintos usuarios
  },
  nombre: {
    type: String,
    required: true
    // Este campo puede repetirse, ya que no es único.
  }
}, {
  timestamps: true // Registra createdAt y updatedAt automáticamente.
});

export default mongoose.model("Sincronizacion", sincronizacionSchema, "sincronizacion");
