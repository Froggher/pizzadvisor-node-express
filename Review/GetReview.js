import { pool } from "../misc/config.js";
import { DatabaseConnection, tokenAuth } from "../misc/Fun.js";


export async function GetReview(req, res, next) {

    // Conn deve stare fuori per chiudere la connessione sul finally
    let conn;

    try {
        conn = await DatabaseConnection(res, pool);
        console.log("NANIRPIMA")
        await ReviewGetDatabase(req, res, conn);
    } catch (error) {
        console.log('Qualcosa é andato storto durante il get della review generale');
    } finally {
        if (conn) return conn.end();
    }

}


// Si occupa di immettere i dati utente in una tabella del db
async function ReviewGetDatabase(req, res, conn) {
    try {
        console.log("NANI")
        const results = await conn.query(`SELECT user.first_name, user.last_name, review.review_object, review.review_body, review.created, review.modified
        FROM user.user
        LEFT JOIN place.review
        ON email = email_id
        WHERE review.place_id = ?
        ORDER BY review.created ASC;`, [ req.params.place_id]);
        res.status(201).send({
            message: 'Get reviews OK',
            review: results
        });
    } catch (err) {
        console.error('Errore get review', err);
        res.status(500).send({ message: 'Errore nel get della review'});
        throw Error;
    }
}


