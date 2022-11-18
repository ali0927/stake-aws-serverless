const express = require('express')
const cors = require('cors')

const app = express()
const port = 8000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.use('/api/aqualis', require('./api/stake'))

app.listen(port, () => console.log(`Listening on localhost: ${port}`))