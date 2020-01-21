/*
 * This file creates a connection to the DB
 */
const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'roomrental'
})

const getConnection = () => {
    return pool;
}

module.exports = getConnection;