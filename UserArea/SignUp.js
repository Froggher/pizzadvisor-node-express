import { pool } from "../misc/config.js";
import { DatabaseConnection } from "../misc/Fun.js";


export async function SignUp(req, res, next) {

    // Conn deve stare fuori per chiudere la connessione
    let conn;

    try {
        conn = await DatabaseConnection(res, pool);
        await SignUpPost(req, res, conn)
    } catch (error) {
        console.log('Qualcosa é andato storto con la creazione account')
    } finally {
        if (conn) return conn.end();
    }



}

// Si occupa di immettere i dati utente in una tabella del db
async function SignUpPost(req, res, conn) {
    const { email, psw, first_name, last_name } = req.body
    try {
        await conn.query("INSERT INTO `User`.`User` value (?,?,?,?)", [email, psw, first_name, last_name]);
        //console.log(results)
        res.status(201).send({
            message: 'Account creato con successo'
        });
    } catch (err) {
        console.error('Errore creazione account:', err.errno);
        // Se l'errore riportato dal database corrisponde a 1062 significa che c'é un valore duplicato per la email
        if (err.errno === 1062) {
            res.status(409).send({ message: 'Utente giá registrato', });
        }
        res.status(400).send({ message: 'Errore nella creazione account', });
    }
}


