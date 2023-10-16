import { pool } from "../config.js";


export async function mariaConnection(req, res, next) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT Column1 FROM Esempio.datibellissimi;');
        console.log(rows); //[ {val: 1}, meta: ... ]
        //const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
        //console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
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

