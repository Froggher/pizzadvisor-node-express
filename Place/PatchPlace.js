import { pool } from "../misc/config.js";
import { DatabaseConnection, tokenAuth } from "../misc/Fun.js";

export async function PatchPlace(req, res, next) {

    // Conn deve stare fuori per chiudere la connessione sul finally
    let conn;

    try {
        conn = await DatabaseConnection(res, pool);
        await patchPlaceDatabase(req, res, conn)

    } catch (error) {
        console.log('Qualcosa é andato storto durante il patch aggiornamento del place generale', error);
    } finally {
        if (conn) return conn.end();
    }

}





async function patchPlaceDatabase(req, res, conn) {
    const { place_id, full_name, lat, lng, only_name, formatted_address, opening_hours, is_open, formatted_phone_number, website, price_level, google_rating } = req.body
    try {
        await conn.query(`UPDATE place.place
        SET place_id = ?,
            full_name = ?,
            lat = ?,
            lng = ?,
            only_name = ?,
            formatted_address = ?,
            opening_hours = ?,
            formatted_phone_number = ?,
            website = ?,
            price_level = ?,
            google_rating = ?
        WHERE place_id = ?;`,
            [place_id, full_name, lat, lng, only_name, formatted_address, JSON.stringify(opening_hours), formatted_phone_number, website, price_level, google_rating, place_id]);
        res.status(201).send({
            message: 'Place aggiornato con successo'
        });
    } catch (err) {
        console.error('Errore Inserimento aggiornamento dati place nel database', err);
        res.status(500).send({ message: 'Errore nel trascrivere i dati aggiornati nel database', });
        throw Error;
    }
}