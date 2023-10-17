import mariadb from 'mariadb';
import 'dotenv/config'

//require('dotenv').config()
export const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    connectionLimit: 5
});



