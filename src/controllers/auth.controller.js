import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

//Registro
export const register = async (req,res)=>{
    const {name,username,email,pregunta, respuesta,contra,confirmContra,rol}= req.body;
        
    //Busqueda de usuario
    const userFound= await User.findOne({email});
    if(userFound) return res.status(409).json(["El correo ya esta registrado"])

    try {
        //validacion para contraseñas
        if(contra!==confirmContra) return res.status(400).json({message:"Las contraseñas no coinciden"});
        //Encriptar la contraseña
        const has1 = await bcrypt.hash(contra,10);

        const newUser= new User({
            name,
            username,
            email,
            pregunta,
            respuesta,
            contra:has1,
            rol
        });

        const userSaved = await newUser.save();

        const token = await createAccessToken({
            id: userSaved._id,
            rol: userSaved.rol,
            nombre: userSaved.name.nombres,
            });
        res.cookie("token",token);

        res.json({
            id: userSaved._id,
            rol: userSaved.rol,
            name: userSaved.name.nombres,
            username: userSaved.username, 
            email: userSaved.email
        });

    } catch (error) {
        console.error("Error al guardar:", error);
        res.status(500).json({ message: "Error al guardar", error });
    }
}

//Login
export const login = async (req, res) =>{
    const {email,contra} = req.body;
    try{
        //Si el usuario existe(por email)
        const userFound= await User.findOne({email});
        //
        if(!userFound) return res.status(400).json({message:"Usuario no encontrado"});

        const isMatch= await bcrypt.compare(contra,userFound.contra);

        if(!isMatch) return res.status(400).json({message:"Contraseña incorrecta"});
        
        const token = await createAccessToken({
            id: userFound._id,
            rol: userFound.rol,
            user: userFound.username,
            nombre: userFound.name.nombres,
            ap: userFound.name.apellidopaterno,
            am: userFound.name.apellidomaterno
            });
                 
        res.cookie("token",token);

        res.json({
            id: userFound._id,
            rol: userFound.rol,
            name: userFound.name,
            username: userFound.username, 
            email: userFound.email,
            telefono: userFound.telefono,
            direccion: userFound.direccion,
            ciudad: userFound.ciudad
        });
    }catch(error){
        console.log("Error al encontrar")
    }
};

//Logout
export const logout = async (req,res)=>{
    res.cookie('token',"",{
        expires: new Date(0)
    })
    return res.sendStatus(200);
}

export const verifyToken = async (req,res)=>{
    const {token} = req.cookies ;

    if(!token) return res.status(401).json({message: "No autorizado"});

    jwt.verify(token,TOKEN_SECRET, async (err,user)=>{
        if(err) return res.status(401).json({message: "No autorizado"});

        const userFound = await User.findById(user.id) 
        if(!userFound) return res.status(401).json({message: "No autorizado"});

        return res.json({
            id: userFound._id,
            name: userFound.name,
            username: userFound.username, 
            email: userFound.email,
            rol: userFound.rol,
            direccion: userFound.direccion,
            telefono: userFound.telefono,
            ciudad: userFound.ciudad
        });
    })
}

export const updateUser = async (req, res) => {
    const { name, telefono, direccion, ciudad, username, pregunta, respuesta } = req.body;
    const userEmail = req.params.email; // Obtenemos el email desde la URL
  
    try {
      // Buscamos al usuario por su email
      const userFound = await User.findOne({ email: userEmail });
      if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });
  
      // Actualizamos solo los campos que se proporcionan en la solicitud
      if (name) {
        userFound.name = {
          ...userFound.name, // Conserva los valores existentes
          ...name,         // Actualiza con lo nuevo (debe tener {nombres, apellidopaterno, apellidomaterno})
        };
      }
      if (telefono) userFound.telefono = telefono;
      if (direccion) userFound.direccion = direccion;
      if (ciudad) userFound.ciudad = ciudad;
      if (username) userFound.username = username;
      if (pregunta) userFound.pregunta = pregunta;
      if (respuesta) userFound.respuesta = respuesta;
  
      await userFound.save();
  
      // Devuelve el usuario actualizado con todos los campos necesarios
      res.json({
        _id: userFound._id,
        rol: userFound.rol,
        name: userFound.name,
        username: userFound.username,
        email: userFound.email,
        telefono: userFound.telefono,
        direccion: userFound.direccion,
        ciudad: userFound.ciudad,
        pregunta: userFound.pregunta,
        respuesta: userFound.respuesta,
      });
    } catch (error) {
      console.error("Error al actualizar:", error);
      res.status(500).json({ message: "Error al actualizar", error });
    }
  };
  

export const updatePassword = async (req, res) => {
    const { email, newPassword } = req.body; 

    try {
        // Buscamos al usuario por su email
        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(404).json({ message: "Usuario no encontrado" });

        // Encriptamos la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        userFound.contra = hashedPassword;

        // Guardamos el usuario con la nueva contraseña
        await userFound.save();

        res.json({ message: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        res.status(500).json({ message: "Error al actualizar la contraseña", error });
    }
};

export const checkEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(404).json({ message: "Email no encontrado" });

        res.json({ 
            message: "Email encontrado", 
            pregunta: userFound.pregunta 
        });
    } catch (error) {
        console.error("Error al verificar el email:", error);
        res.status(500).json({ message: "Error al verificar el email", error });
    }
};

export const checkAnswer = async (req, res) => {
    const { email, respuesta } = req.body;

    try {
        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(404).json({ message: "Email no encontrado" });

        // Verificamos si la respuesta coincide
        const isMatch = (userFound.respuesta === respuesta);
        if (!isMatch) return res.status(400).json({ message: "Respuesta incorrecta" });

        res.json({ message: "Respuesta correcta" });
    } catch (error) {
        console.error("Error al verificar la respuesta:", error);
        res.status(500).json({ message: "Error al verificar la respuesta", error });
    }
};