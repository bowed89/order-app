const { Pool } = require('pg');
require('dotenv').config();

// DIGITAL OCEAN VPS_PG
try {
    const con = new Pool({
        connectionString: process.env.PG_CONNECTION_STRING
    });
    
    con.connect();
    module.exports = con;

} catch (error) {
    console.error('Error al conectar a la base de datos:', error);
}






