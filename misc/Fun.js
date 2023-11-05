import jwt from "jsonwebtoken";
import 'dotenv/config'
import { pool } from "../misc/config.js";

// Verifica che il collegamento con il database viene effettuato correttamente
export async function DatabaseConnection(res, pool) {
    try {
        const conn = await pool.getConnection();
        return conn;
    } catch (err) {
        console.error('Errore nella connessione al database:', err);
        res.status(500).send({ message: 'Il server non é riuscito a collegarsi al database', });
        throw Error;
    }
}


// Verifica l'autenticitá di un token
export function tokenAuth(res, req) {
    try {
        const decodedToken = jwt.verify(req.headers.token, process.env.JWT_SECRET);
        return decodedToken;
    } catch (err) {
        console.error('Errore di verifica token', err);
        res.status(500).send({ message: 'Effettuare nuovamente il login, sessione scaduta', });
        throw Error;
    }
}

// Verifica se l'utente é un moderatore
export async function isModCheck(res, req, email, conn) {
    try {
        const results = await conn.query("SELECT is_mod FROM `user`.`user` WHERE email = ?;", [email]);
        if (!results[0]) {
            res.status(400).send({ message: 'Non si hanno i permessi necessari per effettuare questa azione', });
            throw Error;
        }

    } catch (err) {
        console.error('Errore di verifica controllo moderatore', err);
        res.status(500).send({ message: 'Errore di verifica controllo moderatore', });
        throw Error;
    }
}









export async function TestToken(req, res, next) {
    let conn;
    try {
        conn = await pool.getConnection();
        const decodedToken = tokenAuth(res, req);
        console.log(decodedToken)
        res.status(200).send({
            message: 'ciao',
            data: decodedToken.email
        });
    } catch (err) {
        console.error('Errore nella connessione al database token:', err);
        res.status(500).send({ message: 'Errore nella connessione al database token', });
    } finally {
        if (conn) return conn.end();
    }
}




