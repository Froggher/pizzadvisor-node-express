import { pool } from "../misc/config.js";
import { DatabaseConnection, tokenAuth } from "../misc/Fun.js";

export async function PostFollow(req, res, next) {
    // Conn deve stare fuori per chiudere la connessione sul finally
    let conn;
    try {
        
        conn = await DatabaseConnection(res, pool);
        const decodedToken = tokenAuth(res, req)
        await insertFollow(req, res, conn, decodedToken.email);
        //res.status(200).send({ is_present: true, });
    } catch (error) {
        console.log('Qualcosa é andato storto nel check del post follow nel db generale')
        throw Error;
    } finally {
        if (conn) return conn.end();
    }


}


// Si occupa di inserire il follow nel database
async function insertFollow(req, res, conn, email) {
    try {
        const results = await conn.query(`INSERT INTO user.follow
        (email_id, place_id)
        VALUES(?,?);`, [email, req.body.place_id]);


        res.status(200).send({ message: 'Follow Inserted' });

    } catch (err) {
        console.error('Qualcosa é andato storto nel check del post follow nel db', err);
        res.status(500).send({ message: 'Qualcosa é andato storto nel check del post follow nel db', });
        throw Error;
    }
}


