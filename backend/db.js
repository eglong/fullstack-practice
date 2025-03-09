require('dotenv').config()
const mysql = require('mysql2')

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.stack)
        return
    }
    console.log('Connected to MariaDB')
    connection.release()
})

module.exports = db