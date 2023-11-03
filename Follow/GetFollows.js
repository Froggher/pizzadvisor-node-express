import { pool } from "../misc/config.js";
import { DatabaseConnection, tokenAuth } from "../misc/Fun.js";

export async function GetFollows(req, res, next) {
    // Conn deve stare fuori per chiudere la connessione sul finally
    let conn;
    try {
        conn = await DatabaseConnection(res, pool);
        const decodedToken = tokenAuth(res, req)
        await selectFollows(req, res, conn, decodedToken.email);
        //res.status(200).send({ is_present: true, });
    } catch (error) {
        console.log('Qualcosa é andato storto nel check dei follows degli utenti nel db generale')
        throw Error;
    } finally {
        if (conn) return conn.end();
    }


}


// Si occupa di mandare tutti follows dell'utente
async function selectFollows(req, res, conn, email) {
    try {
        const results = await conn.query(`SELECT place.place_id, place.lat, place.lng, place.only_name, place.formatted_address
        FROM user.follow
        LEFT JOIN place.place
        ON follow.place_id = place.place_id 
        WHERE follow.email_id = ?
        ORDER BY follow.created ASC;`, [email]);

        if (results[0] === undefined) {
            res.status(200).send({ is_present: false });
        } else {
            res.status(200).send({
                is_present: true,
                place: results
            });
        }



    } catch (err) {
        console.error('Qualcosa é andato storto nei follows degli utenti nel db', err);
        res.status(500).send({ message: 'Qualcosa é andato storto nei follows degli utenti nel db', });
        throw Error;
    }
}


