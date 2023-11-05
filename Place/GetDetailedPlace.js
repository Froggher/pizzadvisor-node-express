import { pool } from "../misc/config.js";
import { DatabaseConnection, tokenAuth } from "../misc/Fun.js";


export async function GetDetailedPlace(req, res, next) {

    // Conn deve stare fuori per chiudere la connessione sul finally
    let conn;

    try {
        conn = await DatabaseConnection(res, pool);
        await PlacesGetDatabase(req, res, conn);
    } catch (error) {
        console.log('Qualcosa é andato storto durante il get dei luoghi dettagliato generale');
    } finally {
        if (conn) return conn.end();
    }

}




// Si occupa di prendere i dati del singolo place per la vista dettagliata del place
async function PlacesGetDatabase(req, res, conn) {
    try {
        const results = await conn.query(`SELECT *
        FROM place.place
        WHERE place_id=(?);`,[req.params.place_id]);
        res.status(201).send({
            message: 'Get detailed place OK',
            det_place: results[0]
        });
    } catch (err) {
        console.error('Errore get dettagliato dei luoghi', err);
        res.status(500).send({ message: 'Errore nel get dettagliato dei luoghi'});
        throw Error;
    }
}


