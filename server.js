const express = require('express')
const db = require('./db')
const app = express()
require('dotenv').config() // Load environment variables from .env file
const PORT = process.env.PORT
const passport = require('./auth')
const Person = require('./models/Person')
const bodyParser = require('body-parser')

//Importing the router files
const personRoutes = require('./routes/personRoutes')
const menuRoutes = require('./routes/menuRoutes')

app.use(bodyParser.json()) // Middleware to parse JSON bodies
//bodyparser will save the data in req.body


app.use(passport.initialize()); // Initialize passport middleware

//authentication middleware using local strategy
const authenticate = passport.authenticate('local', { session: false });

app.use('/person', personRoutes)
app.use('/menu', menuRoutes)
// The above lines mount the person and menu routes to the main app.\
//every time user will have to authenticate before accessing these routes




//Middleware function

// This function logs the request URL and timestamp
const logRequest = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] request for '${req.originalUrl}'`);
    next();
};

app.use(logRequest); // Use the logRequest middleware for all routes
app.get('/', logRequest, function (req, res) {
    res.send('Welcome to our hotel');
}); //use the logRequest middleware for this route only



app.get('/', function (req, res) {
    res.send('Welcome to our hotel');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
