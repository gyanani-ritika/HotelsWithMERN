const express = require('express')
const db = require('./db')
const app = express()
require('dotenv').config() // Load environment variables from .env file
const PORT = process.env.PORT

const bodyParser = require('body-parser')
app.use(bodyParser.json()) // Middleware to parse JSON bodies
//bodyparser will save the data in req.body

app.get('/main', (req, res) => {
    res.send('Hello World')
})

//Importing the router files
const personRoutes = require('./routes/personRoutes')
const menuRoutes = require('./routes/menuRoutes')

app.use('/person', personRoutes)
app.use('/menu', menuRoutes)
// The above lines mount the person and menu routes to the main app.

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
