import { pool } from "../misc/config.js";
import { DatabaseConnection, preparePlaceFirstTime, tokenAuth } from "../misc/Fun.js";


export async function PostReview(req, res, next) {

    // Conn deve stare fuori per chiudere la connessione sul finally
    let conn;

    try {
        conn = await DatabaseConnection(res, pool);
        const decodedToken = tokenAuth(res, req)
        await preparePlaceFirstTime(req, res, conn);
        await ReviewPostDatabase(req, res, conn, decodedToken.email);
    } catch (error) {
        console.log('Qualcosa é andato storto durante il post della review generale');
    } finally {
        if (conn) return conn.end();
    }

}




// Si occupa di immettere i dati utente in una tabella del db
async function ReviewPostDatabase(req, res, conn, dec_email) {
    const { review_object, review_body } = req.body;
    try {
        await conn.query("INSERT INTO `place`.`review` (email_id, review_object, review_body, place_id)  value (?,?,?,?);", [ dec_email, review_object, review_body, req.params.place_id]);
        //console.log(results)
        res.status(201).send({
            message: 'Review aggiunta con successo'
        });
    } catch (err) {
        console.error('Errore post review', err);
        res.status(500).send({ message: 'Errore nel post della review'});
        throw Error;
    }
}


