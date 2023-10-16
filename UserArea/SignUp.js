import { pool } from "../config.js";


export async function SignUp(req, res, next) {
    const { email, psw, first_name, last_name } = req.body
    console.log(psw)
    console.log(req.body)
    let conn;
    try {
        conn = await pool.getConnection();
        //const rows = await conn.query('SELECT Column1 FROM Esempio.datibellissimi;');
        //console.log(rows); //[ {val: 1}, meta: ... ]
        const results = await conn.query("INSERT INTO `User`.`User` value (?,?,?,?)", [email, psw, first_name, last_name]);
        //console.log(res)
        //console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
        console.log(results)
        res.status(200).send({
            message: 'Account creato con successo'
        });
    } catch (err) {
        console.error('Errore nella connessione al database:', err);
        res.status(500).send({ message: 'Errore creazione account', });
    } finally {
        if (conn) return conn.end();
    }
}


// const TestDatabase = () => {
// pool.

// }

