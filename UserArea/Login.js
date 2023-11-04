import { pool } from "../misc/config.js";
import { DatabaseConnection } from "../misc/Fun.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import 'dotenv/config'

export async function SignIn(req, res, next) {

    // Conn deve stare fuori per chiudere la connessione
    let conn;

    try {
        conn = await DatabaseConnection(res, pool);
        const results = await signInSelectDatabase(req, res, conn);
        await passordCheck(req, res, conn, results);
        tokenSign(req, res, conn, results);
    } catch (error) {
        console.log('Qualcosa é andato storto con il login')
    } finally {
        if (conn) return conn.end();
    }


}

async function tokenSign(req, res, conn, results) {
    try {
        // Viene generato il token con all'interno firmata anche la email dell'utente
        // Per la creazione viene utilizzato JWT_SECRET e JWT_EXPIRES_IN
        const token = jwt.sign({
            email: results.email
        },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        console.log(results)
        res.status(200).send({
            message: 'Login effettuato con successo',
            user: {
                email: results.email,
                token: token,
                first_name: results.first_name,
                last_name: results.last_name,
                follows: results.follows,
                is_mod: results.is_mod,
            }
        });
    } catch (err) {
        console.error('Errore creazione token', err);
        res.status(500).send({ message: 'Errore creazione token', });
        throw Error;
    }
}



async function passordCheck(req, res, conn, results) {
    const { email, psw } = req.body
    try {
        // Qui controlliamo se la password inviata dall'utente corrisponde a quella contenuta nel database(hash)
        const checkedPsw = await bcrypt.compare(psw, results.psw);
        if (!checkedPsw) {
            res.status(401).send({ message: 'Password errata', });
            throw Error;
        }
    } catch (err) {
        console.error('Errore controllo password', err);
        res.status(500).send({ message: 'Errore controllo password', });
        throw Error;
    }
}


async function signInSelectDatabase(req, res, conn) {
    const { email, psw } = req.body
    try {
        const results = await conn.query("SELECT email, psw, first_name, last_name, is_mod FROM `user`.`user` WHERE email = ?;", [email]);

        // In caso il risultato della query è undefined la email non è presente nel sitema
        if (!results[0]) {
            res.status(400).send({ message: 'Email non trovata, effettuare prima la registrazione', });
            throw Error;
        }
        return results[0]
    } catch (err) {
        console.error('Errore login:', err);
        res.status(500).send({ message: 'Errore login', });
        throw Error;
    }
}