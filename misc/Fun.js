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

// Verifica l'autenticitá di un token
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




export async function preparePlaceFirstTime(req, res, conn) {

    try {
        const results = await isPlaceInserted(req, res, conn);
        if (!results) {
            await postPlace(req, res, conn)
        }

    } catch (error) {
        console.log('Qualcosa é andato storto nella ricerca check database del place')
        throw Error;
    }


}


// Si occupa di controllare la presenza di place nel database
async function isPlaceInserted(req, res, conn) {
    try {
        const results = await conn.query("SELECT place_id FROM `place`.`place` WHERE place_id = ?;", [req.params.place_id]);
        if (results[0] === undefined) {
            console.log('results')
            return false;
        } else {
            return true;
        }
    } catch (err) {
        console.error('Errore ricerca per place su database:', err);
        res.status(500).send({ message: 'Errore nella ricerca check database del place', });
        throw Error;
    }
}


// Si occupa di controllare la presenza di place nel database
async function postPlace(req, res, conn) {
    const { full_name, lat, lng, restaurant, pizza} = req.body
    try {
        await conn.query("INSERT INTO `place`.`place` value (?,?,?,?,?,?);", [req.params.place_id, full_name, lat, lng, restaurant, pizza]);
    } catch (err) {
        console.error('Errore Inserimento dati place nel database', err);
        res.status(500).send({ message: 'Errore nel trascrivere i dati nel database del locale', });
        throw Error;
    }
}