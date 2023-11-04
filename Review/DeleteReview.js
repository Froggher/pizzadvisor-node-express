import { pool } from "../misc/config.js";
import { DatabaseConnection, isModCheck, tokenAuth } from "../misc/Fun.js";

export async function DeleteReview(req, res, next) {
    // Conn deve stare fuori per chiudere la connessione sul finally
    let conn;
    try {
        conn = await DatabaseConnection(res, pool);
        const decodedToken = tokenAuth(res, req);
        console.log(decodedToken);
        await isModCheck(req, res, decodedToken.email, conn);
        await deleteReview(req, res, conn, decodedToken.email);

        //res.status(200).send({ is_present: true, });
    } catch (error) {
        console.log('Qualcosa é andato storto nel check del delete review nel db generale')
        throw Error;
    } finally {
        if (conn) return conn.end();
    }


}


// Si occupa di eliminare i follow dai database
async function deleteReview(req, res, conn, email) {
    try {
        const results = await conn.query(
            "DELETE FROM place.review WHERE review_id = ? AND email_id = ?",
            [req.body.review_id, email]
        );

        res.status(200).send({ message: 'Follow Deleted' });

    } catch (err) {
        console.error('Qualcosa é andato storto nel delete della review nel db', err);
        res.status(500).send({ message: 'Qualcosa é andato storto nel delete della review nel db', });
        throw Error;
    }
}


