import { pool } from "../misc/config.js";
import { DatabaseConnection, preparePlaceFirstTime, tokenAuth } from "../misc/Fun.js";


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




// Si occupa di immettere i dati utente in una tabella del db
async function PlacesGetDatabase(req, res, conn) {
    try {
        const results = await conn.query(`SELECT place_id, full_name, lat, lng, restaurant, pizza
        FROM place.place;`);
        console.log(results)
        res.status(201).send({
            message: 'Get reviews OK',
            place: results
        });
    } catch (err) {
        console.error('Errore get dei luoghi', err);
        res.status(500).send({ message: 'Errore nel get dei luoghi'});
        throw Error;
    }
}


