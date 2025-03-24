import mongoose from "mongoose";

const ventanaSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true
  }
});

export default mongoose.model("Ventana", ventanaSchema, "ventana");
