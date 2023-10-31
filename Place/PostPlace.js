import { pool } from "../misc/config.js";
import { DatabaseConnection, tokenAuth } from "../misc/Fun.js";

export async function PostPlace(req, res, next) {

    // Conn deve stare fuori per chiudere la connessione sul finally
    let conn;

    try {
        conn = await DatabaseConnection(res, pool);
        const results = await isPlaceInserted(req, res, conn);
        //!results
        if (!results) {
            await postPlaceDatabase(req, res, conn)
        }
    } catch (error) {
        console.log('Qualcosa é andato storto durante il post del place generale');
    } finally {
        if (conn) return conn.end();
    }

}





// Si occupa di controllare la presenza di place nel database
async function isPlaceInserted(req, res, conn) {
    try {
        const results = await conn.query("SELECT place_id FROM `place`.`place` WHERE place_id = ?;", [req.body.place_id]);
        if (results[0] === undefined) {
            return false;
        } else {
            console.log('results')
            res.status(201).send({
                message: 'Place giá aggiunto'
            });
            return true;
            
        }
    } catch (err) {
        console.error('Errore ricerca per place su database:', err);
        res.status(500).send({ message: 'Errore nella ricerca check database del place', });
        throw Error;
    }
}


async function postPlaceDatabase(req, res, conn) {
    const { place_id, full_name, lat, lng, only_name, formatted_address, opening_hours, is_open, formatted_phone_number, website, price_level, google_rating } = req.body
    console.log(req.body.opening_hours[0])
    try {
        await conn.query(`INSERT INTO place.place 
        (place_id, full_name, lat, lng, only_name, formatted_address,opening_hours, formatted_phone_number, website, price_level, google_rating)
        VALUES (?,?,?,?,?,?,?,?,?,?,?);`,
            [place_id, full_name, lat, lng, only_name, formatted_address, JSON.stringify(opening_hours), formatted_phone_number, website, price_level, google_rating]);
            res.status(201).send({
                message: 'Place aggiunto con successo'
            });
    } catch (err) {
        console.error('Errore Inserimento dati place nel database', err);
        res.status(500).send({ message: 'Errore nel trascrivere i dati nel database del locale', });
        throw Error;
    }
}