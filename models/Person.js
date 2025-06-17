const mongoose = require('mongoose');

//Person schema definition
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        enum: ['Chef', 'Waiter', 'Owner', 'Manager'],
        required: true
    },
    mobile: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensures that email is unique across all documents
        // will throw an error if a duplicate email is entered
    },
    address: {
        type: String,
    },
    salary: {
        type: Number,
        required: true
    },

});

// Create the model from the schema
const Person = mongoose.model('Person', personSchema);
module.exports = Person;
