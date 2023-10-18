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








// export async function TokenAuth(res) {
//     try {
//         const decodedToken = tokenVerify(res, req);
//         console.log(decodedToken);
//     } catch (err) {
//         console.error('Errore di autenticazione da parte del server', err);
//         res.status(500).send({ message: 'Errore di autenticazione da parte del server', });
//         throw Error;
//     }
// }


export function tokenAuth(res, req) {
    console.log(req.headers.token)
    try {
        const decodedToken = jwt.verify(req.headers.token, process.env.JWT_SECRET);
        return decodedToken;
    } catch (err) {
        console.error('Errore di verifica token', err);
        res.status(500).send({ message: 'Effettuare nuovamente il login, sessione scaduta', });
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