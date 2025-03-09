const express = require('express')
const router = express.Router()
const db = require('../backend/db')


router.get('/test-db', (req, res) => {
    db.execute('SELECT NOW() AS time', (err, results) => {
        if (err) {
            console.error('Error querying database:', err.message)
            return res.status(500).send('Database query failed')
        }
        console.log('Database query successful:', results)
        res.send(`Database connected. Server time: ${results[0].time}`)
    })
})

module.exports = router