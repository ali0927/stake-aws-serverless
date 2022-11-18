const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 80

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use('/api/stake', require('./api/stake'))

app.listen(port, () => console.log(`Listening on localhost: ${port}`))