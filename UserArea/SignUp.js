import { pool } from "../misc/config.js";
import { DatabaseConnection } from "../misc/Fun.js";
import bcrypt from 'bcryptjs';

export async function SignUp(req, res, next) {

    // Conn deve stare fuori per chiudere la connessione sul finally
    let conn;

    try {
        conn = await DatabaseConnection(res, pool);
        const hashedPassword = await PasswordHashing(req, res, conn);
        await SignUpInsert(req, res, conn, hashedPassword);
    } catch (error) {
        console.log('Qualcosa é andato storto con la creazione account');
    } finally {
        if (conn) return conn.end();
    }

}

// Qui la password viene 'hashata' insieme al sale
async function PasswordHashing(req, res, conn) {
    const { email, psw, first_name, last_name } = req.body;
    try {
        // Serve per la creazione del sale della password
        // Il sale serve per aumentare la sicurezza dell'hash
        const salt = await bcrypt.genSalt(10);
        // Qui viene effettuato l'hash della password 'mischiato' con il sale
        const hashedPassword = await bcrypt.hash(psw, salt);
        return hashedPassword;

    } catch (err) {
        console.error('Errore creazione hash:', err);
        res.status(500).send({ message: 'Errore nella creazione hash della passord con il sale', });
        throw Error;
    }
}


// Si occupa di immettere i dati utente in una tabella del db
async function SignUpInsert(req, res, conn, hashedPassword) {
    const { email, psw, first_name, last_name } = req.body;
    try {
        await conn.query("INSERT INTO `User`.`User` value (?,?,?,?);", [email, hashedPassword, first_name, last_name]);
        //console.log(results)
        res.status(201).send({
            message: 'Account creato con successo'
        });
    } catch (err) {
        console.error('Errore creazione account:', err);
        // Se l'errore riportato dal database corrisponde a 1062 significa che c'é un valore duplicato per la email
        if (err.errno === 1062) {
            res.status(409).send({ message: 'Utente giá registrato', });
        }
        res.status(500).send({ message: 'Errore nella creazione account', });
        throw Error;
    }
}


