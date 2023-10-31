import { pool } from "../misc/config.js";
import { DatabaseConnection, tokenAuth } from "../misc/Fun.js";

export async function CheckPlace(req, res, next) {
    // Conn deve stare fuori per chiudere la connessione sul finally
    let conn;
    try {
        conn = await DatabaseConnection(res, pool);
        await isPlaceInserted(req, res, conn);
        //res.status(200).send({ is_present: true, });
    } catch (error) {
        console.log('Qualcosa é andato storto nel check del place nel db generale')
        throw Error;
    } finally {
        if (conn) return conn.end();
    }


}


// Si occupa di controllare la presenza di place nel database
async function isPlaceInserted(req, res, conn) {
    try {
        const results = await conn.query("SELECT place_id FROM place.place WHERE place_id = ?;", [req.params.place_id]);
        if (results[0] === undefined) {
            console.log('chek false')
            res.status(200).send({ is_present: false, });
        } else {
            console.log('chek true')
            res.status(200).send({ is_present: true, });
        }
    } catch (err) {
        console.error('Qualcosa é andato storto nel check del place nel db', err);
        res.status(500).send({ message: 'Qualcosa é andato storto nel check del place nel db', });
        throw Error;
    }
}


