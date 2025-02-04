const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const con = require('../server/config');
const { generarJWT } = require('../helpers/generarJWT.js');
const jwt = require('jsonwebtoken');

require('dotenv/config');

router.get('/', async (req, res) => {
    try {
        const response = await con.query(`SELECT * FROM usuario`);
        if (!response) {
            res.status(500).json({ success: false });
        }
        res.send(response.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// REGISTRAR NUEVO USUARIO
router.post('/signup', async (req, res) => {
    try {
        var params = req.body;
        const query = {
            text: 'INSERT INTO usuario(nombre, apellido, rol, login, password, created_on) VALUES($1, $2, $3, $4, $5, current_timestamp) RETURNING *',
            values: [params.nombre, params.apellido, params.rol, params.login, bcrypt.hashSync(params.password, 10)]
        };
        const result = await con.query(query);
        res.status(200).json({ res: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//LOGIN
router.post('/signin', async (req, res) => {
    try {
        if (!req.body.login || !req.body.password) return res.status(400).json({ msg: 'Por favor introduzca el Usuario y/o Contraseña' });
        const query = {
            text: 'SELECT * FROM usuario WHERE login=$1',
            values: [req.body.login],
        };
        const result = await con.query(query);
        if (result.rowCount == 0) return res.status(400).json({ msg: 'Usuario no válido' });
        if (!bcrypt.compareSync(req.body.password, result.rows[0].password)) {
            return res.status(400).json({ msg: 'Contraseña no válida' });
        }
        let generador = result.rows[0];
        delete generador.password;

        return res.status(200).json({
            res: generador,
            token: generarJWT(generador)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// VERIFICAR TOKEN
router.get('/renew', (req, res) => {
    try {
        const { token } = req.headers; // agarra el token del header
        let payload;

        if (token) {
            payload = jwt.verify(token, process.env.JWT_SECRET); //decodifica el token
            return res.status(200).json({
                login: payload.generador.login,
                token
            });
        }

        throw new Error("Token no proporcionado");

    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: "Token ha expirado" });
        } else {
            return res.status(401).json({ msg: "Token no válido" });
        }
    }
});

module.exports = router;

