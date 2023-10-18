import { pool } from "../misc/config.js";


export async function mariaConnection(req, res, next) {
    let conn;
    try {
        conn = await pool.getConnection();
        
        res.status(200).send({ message: 'ciao', });
    } catch (err) {
        console.error('Errore nella connessione al database:', err);
        res.status(500).send({ message: 'Errore nella connessione al database', });
    } finally {
        if (conn) return conn.end();
    }
}


// const TestDatabase = () => {
// pool.

// }

