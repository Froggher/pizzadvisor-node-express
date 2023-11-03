import { pool } from "../misc/config.js";
import { DatabaseConnection, tokenAuth } from "../misc/Fun.js";

export async function DeleteFollow(req, res, next) {
    // Conn deve stare fuori per chiudere la connessione sul finally
    let conn;
    try {
        console.log('Qualcos')
        conn = await DatabaseConnection(res, pool);
        const decodedToken = tokenAuth(res, req)
        await deleteFollow(req, res, conn, decodedToken.email);
        //res.status(200).send({ is_present: true, });
    } catch (error) {
        console.log('Qualcosa é andato storto nel check del post follow nel db generale')
        throw Error;
    } finally {
        if (conn) return conn.end();
    }


}


// Si occupa di eliminare i follow dai database
async function deleteFollow(req, res, conn, email) {
    try {
        const results = await conn.query(
            "DELETE FROM `user`.follow WHERE place_id = ? AND email_id = ?",
            [req.body.place_id, email]
          );
          
        res.status(200).send({ message: 'Follow Deleted' });

    } catch (err) {
        console.error('Qualcosa é andato storto nel check del post follow nel db', err);
        res.status(500).send({ message: 'Qualcosa é andato storto nel check del post follow nel db', });
        throw Error;
    }
}


