import { pool } from "../misc/config.js";
import { DatabaseConnection } from "../misc/Fun.js";

export async function Login(req, res, next) {

    // Conn deve stare fuori per chiudere la connessione
    let conn;

    try {
        conn = await DatabaseConnection(res, pool);
        const results = await LoginCheckDatabase(req, res, conn)
        console.log(results)
    } catch (error) {
        console.log('Qualcosa é andato storto con il login')
    } finally {
        if (conn) return conn.end();
    }


}

async function LoginCheckDatabase(req, res, conn){
    const { email, psw } = req.body
    try {
        const results = await conn.query("SELECT email, psw, first_name, last_name FROM `User`.`User` WHERE email = ?;", [email]);

        // In caso il risultato della query è undefined la email non è presente nel sitema
        if (!results[0]) {
            res.status(400).send({ message: 'Email non trovata, effettuare prima la registrazione', });
            throw Error
        }
        // res.status(200).send({
        //     message: 'Account trovato con successo'
        // });
        return results[0]
    } catch (err) {
        console.error('Errore login:', err);
        // Se l'errore riportato dal database corrisponde a 1062 significa che c'é un valore duplicato per la email
        // if (err.errno === 1062) {
        //     res.status(409).send({ message: 'Utente giá registrato', });
        // }
        res.status(400).send({ message: 'Errore login', });
    }


}