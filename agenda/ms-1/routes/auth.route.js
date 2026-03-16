const router = require('express').Router(); // importamos el router de express para poder definir las rutas de autenticación de la aplicación
const bcrypt = require('bcryptjs'); // encriptar o desencriptar la contraseña
const jwt = require('jsonwebtoken'); // para generar un token de autenticación, que se usará para proteger las rutas de la aplicación
const User = require('../models/User.js'); // importamos el modelo de usuario para poder crear nuevos usuarios y verificar las credenciales de los usuarios existentes

router.post('/register', async (req, res) => { // async sirve para indicar que la función es asíncrona, lo que significa que puede contener operaciones que tardan un tiempo en completarse, como la interacción con la base de datos
    try {
        const {email, password} = req.body; // extraemos el email y la contraseña del cuerpo de la solicitud
        const passhash = await bcrypt.hash(password, 10); // encriptamos la contraseña utilizando bcrypt, el número 10 es el número de rondas de encriptación, lo que hace que la contraseña sea más segura

        const user = await User.create({ // creamos un nuevo usuario en la base de datos utilizando el modelo de usuario, pasamos el email y la contraseña encriptada
            email,
            password: passhash // passhash sirve para almacenar la contraseña encriptada en la base de datos, en lugar de almacenar la contraseña en texto plano, lo que es una buena práctica de seguridad
        });
        res.status(201).json(user); // respondemos con el usuario creado y un código de estado 201 (creado)
        // res.status(201).json({message: 'Usuario creado correctamente'}); // respondemos con un mensaje de éxito y un código de estado 201 (creado)
    } catch (error) {
        res.status(500).json({message: "Usuario no encontrado " + 
            error.message||""
        }); // si ocurre un error, respondemos con un código de estado 500 (error interno del servidor) y un mensaje de error
    }
}); // ruta para registrar un nuevo usuario, recibe el email y la contraseña del usuario en el cuerpo de la solicitud

router.post('/login', async (req, res) => { // ruta para iniciar sesión, recibe el email y la contraseña del usuario en el cuerpo de la solicitud
    try {
        const {email, password} = req.body; // extraemos el email y la contraseña del cuerpo de la solicitud
        const user = await User.findOne({email}); // buscamos un usuario en la base de datos que coincida con el email proporcionado
        
        if (!user) return res.status(404).json({ 
            message: "Usuario no encontrado" // si no se encuentra un usuario con el email proporcionado, respondemos con un código de estado 404 (no encontrado) y un mensaje de error: 'Usuario no encontrado'}); // return se utiliza para salir de la función y evitar que se ejecute el código siguiente
        });
        
        const valid = await bcrypt.compare(password, user.password); // comparamos la contraseña proporcionada con la contraseña almacenada en la base de datos utilizando bcrypt
        if (!valid) return res.status(401).json({
            message: "Contraseña incorrecta" // si la contraseña no es válida, respondemos con un código de estado 401 (no autorizado) y un mensaje de error: 'Contraseña incorrecta'}); // return se utiliza para salir de la función y evitar que se ejecute el código siguiente
        }); 
        
        const token = jwt.sign(
            {id: user._id, email: user.email}, // el payload del token, que contiene la información del usuario que se incluirá en el token, en este caso el id y el email del usuario
            "asdilvjsdñlbksb9878643609",
            { expiresIn: "1d" } // el token expira en 1 dia
        );

        res.status(200).json({token}); // respondemos con el token generado y un código de estado 200 (éxito)

    } catch (error) {
        res.status(500).json({message: "Error al iniciar sesión " +
            error.message|| "No pudo procesarse la solicitud"

        }); // si ocurre un error, respondemos con un código de estado 500 (error interno del servidor) y un mensaje de error
    }
});

module.exports = router; // exportamos las rutas para que puedan ser utilizadas en otros archivos de la aplicación, como el archivo index.js donde se configuran las rutas de la aplicación