const { Pool } = require('pg');
require('dotenv').config();

const { PG_CONNECTION_STRING, USER, HOST, DATABASE, PASSWORD, PORT } = process.env;
// DIGITAL OCEAN VPS_PG
try {
    /* const con = new Pool({
        connectionString: PG_CONNECTION_STRING
    }); */
    const con = new Pool({
        user: USER,
        host: HOST,
        database: DATABASE,
        password: PASSWORD, // Asegúrate de que esta línea sea una cadena de texto
        port: PORT, // Puerto por defecto de PostgreSQL
    });

    con.connect();
    module.exports = con;

} catch (error) {
    console.error('Error al conectar a la base de datos:', error);
}






