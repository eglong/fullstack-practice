const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const db = require('../db')


router.get('/health', (req, res) => {
    db.execute('SELECT NOW() AS time', (err, results) => {
        if (err) {
            console.error('Error querying database:', err.message)
            return res.status(500).send('Database query failed')
        }
        console.log('Database query successful:', results)
        res.send(`Database connected. Server time: ${results[0].time}`)
    })
})

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            message: 'Missing required fields'
        })
    }

    try {
        const existingUser = await db.execute('SELECT * FROM users WHERE email = ?', [email])
        if (existingUser.length > 0) {
            return res.status(400).json({
                message: 'Email already in use'
            })
        }

        // hash password
        const passwordHash = await bcrypt.hash(password, 10)

        await db.execute('INSERT INTO users (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)',
            [firstName, lastName, email, passwordHash]
        )

        res.status(201).json({
            message: 'User registered successfully'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Server error'
        })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            message: 'Missing required fields'
        })
    }

    try {
        const user = await db.execute('SELECT * FROM users WHERE email = ?', [email])

        if (user.length === 0) {
            return res.status(400).json({
                message: 'User not found'
            })
        }

        // verify password
        const isMatch = await bcrypt.compare(password, user[0].password_hash)
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            })
        }

        res.status(200).json({
            message: 'Login successful'
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Server error'
        })
    }
})

module.exports = router