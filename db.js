const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file
const mongoURL = process.env.LOCAL_DB_URL
const mongoURLRemote = process.env.REMOTE_DB_URL
// process.env.REMOTE_DB_URL is used to get the value of REMOTE_DB_URL from the .env file

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
//useNewUrlParser, useUnifiedTopology mandatory parameters to avoid deprecation warnings

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB');
});
// above message will be printed when the connection is established by just importing this file

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});
db.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});

// Export the connection for use in other modules
module.exports = db;