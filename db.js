const mongoose = require('mongoose');

const mongoURL = 'mongodb://localhost:27017/hotels'; //hotels is the name of the database

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