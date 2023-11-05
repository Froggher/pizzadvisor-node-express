import { pool } from "../misc/config.js";
import { DatabaseConnection, tokenAuth } from "../misc/Fun.js";

export async function CheckFollow(req, res, next) {
    // Conn deve stare fuori per chiudere la connessione sul finally
    let conn;
    try {
        conn = await DatabaseConnection(res, pool);
        const decodedToken = tokenAuth(res, req)
        await isFollowInserted(req, res, conn, decodedToken.email);
        //res.status(200).send({ is_present: true, });
    } catch (error) {
        console.log('Qualcosa é andato storto nel check del follow nel db generale')
        throw Error;
    } finally {
        if (conn) return conn.end();
    }


}


// Si occupa di controllare la presenza dei follow nel database
async function isFollowInserted(req, res, conn, email) {
    try {
        const results = await conn.query(`SELECT id_follow, email_id, place_id
            FROM user.follow
            WHERE place_id = ? AND email_id = ?;`, [req.params.place_id, email]);
        if (results[0] === undefined) {
            res.status(200).send({ is_present: false, });
        } else {
            res.status(200).send({ is_present: true, });
        }
    } catch (err) {
        console.error('Qualcosa é andato storto nel check del follow nel db', err);
        res.status(500).send({ message: 'Qualcosa é andato storto nel check del follow nel db', });
        throw Error;
    }
}


