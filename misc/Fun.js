// Verifica che il collegamento con il database viene effettuato correttamente
export async function DatabaseConnection(res, pool) {
    try {
        const conn = await pool.getConnection();
        //console.log(conn)
        return conn;
    } catch (err) {
        console.error('Errore nella connessione al database:', err);
        res.status(500).send({ message: 'Il server non é riuscito a collegarsi al database', });
    }
}