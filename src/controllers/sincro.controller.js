import Sincronizacion from "../models/Sincronizacion.model.js";
import User from "../models/user.model.js";
import Ventana from "../models/ventana.model.js";

// Agregar una nueva sincronización
export const agregarSincronizacion = async (req, res) => {
  const { email, codigo, nombre } = req.body;
  
  try {
    // Buscar usuario por email
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Buscar ventana por código
    const ventana = await Ventana.findOne({ codigo });
    if (!ventana) {
      return res.status(404).json({ message: "Ventana no encontrada." });
    }

    // Verificar si la ventana ya está sincronizada con otro usuario
    const syncExistente = await Sincronizacion.findOne({ ventana: ventana._id });
    if (syncExistente) {
      if (syncExistente.usuario.toString() !== usuario._id.toString()) {
        return res.status(400).json({ message: "El código ya está sincronizado a otro usuario." });
      } else {
        return res.status(200).json({ message: "Ya tienes sincronización con ese código." });
      }
    }

    // Crear y guardar la nueva sincronización
    const nuevaSincronizacion = new Sincronizacion({
      usuario: usuario._id,
      ventana: ventana._id,
      nombre
    });
    await nuevaSincronizacion.save();

    res.status(201).json({
      message: "Sincronización agregada exitosamente.",
      data: nuevaSincronizacion
    });
  } catch (error) {
    console.error("Error al agregar sincronización:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

// Obtener todas las sincronizaciones de un usuario por email
export const obtenerSincronizacionesPorEmail = async (req, res) => {
  const { email } = req.params;

  try {
    // Buscar usuario por email
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Buscar sincronizaciones por el _id del usuario y popular la información de la ventana
    const sincronizaciones = await Sincronizacion.find({ usuario: usuario._id })
      .populate("ventana");

    if (sincronizaciones.length === 0) {
      return res.status(404).json({ message: "No se encontraron sincronizaciones para este usuario." });
    }
    res.status(200).json(sincronizaciones);
  } catch (error) {
    console.error("Error al obtener sincronizaciones:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

// Eliminar una sincronización a partir del email y código de ventana
export const eliminarSincronizacion = async (req, res) => {
  const { email, codigo } = req.body;

  try {
    // Buscar usuario por email
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Buscar ventana por código
    const ventana = await Ventana.findOne({ codigo });
    if (!ventana) {
      return res.status(404).json({ message: "Ventana no encontrada." });
    }

    // Eliminar la sincronización basada en el usuario y la ventana
    const syncEliminada = await Sincronizacion.findOneAndDelete({
      usuario: usuario._id,
      ventana: ventana._id
    });
    if (!syncEliminada) {
      return res.status(404).json({ message: "Sincronización no encontrada para eliminar." });
    }
    res.status(200).json({ message: "Sincronización eliminada exitosamente." });
  } catch (error) {
    console.error("Error al eliminar sincronización:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

// Obtener todas las sincronizaciones almacenadas
export const obtenerTodasLasSincronizaciones = async (req, res) => {
  try {
    // Buscar todas las sincronizaciones y popular la información del usuario y la ventana
    const sincronizaciones = await Sincronizacion.find()
      .populate("usuario")
      .populate("ventana");

    if (sincronizaciones.length === 0) {
      return res.status(404).json({ message: "No se encontraron sincronizaciones." });
    }
    res.status(200).json(sincronizaciones);
  } catch (error) {
    console.error("Error al obtener todas las sincronizaciones:", error);
    res.status(500).json({ message: "Error interno del servidor", error });
  }
};