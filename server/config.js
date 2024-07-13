const { Pool } = require('pg');
require('dotenv').config();

// DIGITAL OCEAN VPS_PG
try {
    /* const con = new Pool({
        connectionString: PG_CONNECTION_STRING
    }); */
    const con = new Pool({
        user: process.env.USER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD.trim(), // Asegúrate de que esta línea sea una cadena de texto
        port: process.env.PORT, // Puerto por defecto de PostgreSQL
    });

    con.connect();
    module.exports = con;

} catch (error) {
    console.error('Error al conectar a la base de datos:', error);
}






