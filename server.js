const express = require('express')
const app = express()
const port = 3000

const routes = require('./backend/endpoints/routes')

app.use(express.json())
app.use(express.static('public'))

app.use('/api', routes)

app.listen(port, () => {
    console.log(`Server running ata http://localhost:${port}`)
})