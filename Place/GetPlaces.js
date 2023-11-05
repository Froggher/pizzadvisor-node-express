import { pool } from "../misc/config.js";
import { DatabaseConnection, tokenAuth } from "../misc/Fun.js";


export async function GetPlaces(req, res, next) {

    // Conn deve stare fuori per chiudere la connessione sul finally
    let conn;

    try {
        conn = await DatabaseConnection(res, pool);
        await PlacesGetDatabase(req, res, conn);
    } catch (error) {
        console.log('Qualcosa é andato storto durante il get dei luoghi generale');
    } finally {
        if (conn) return conn.end();
    }

}




// Si occupa di ricevere i dati per i markers dal database
async function PlacesGetDatabase(req, res, conn) {
    try {
        const results = await conn.query(`SELECT place_id, full_name, lat, lng
        FROM place.place;`);
        res.status(201).send({
            message: 'Get reviews OK',
            place: results
        });
    } catch (err) {
        console.error('Errore get dei luoghi', err);
        res.status(500).send({ message: 'Errore nel get dei luoghi generale'});
        throw Error;
    }
}


