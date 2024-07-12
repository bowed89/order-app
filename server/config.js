const { Pool } = require('pg');
require('dotenv').config(); 

const { PG_CONNECTION_STRING } = process.env;
// DIGITAL OCEAN VPS_PG
try {
    const con = new Pool({
        connectionString: PG_CONNECTION_STRING
    });
    con.connect();
    module.exports = con;

} catch (error) {
    console.error('Error al conectar a la base de datos:', error);
}






