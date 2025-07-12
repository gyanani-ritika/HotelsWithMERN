const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
        enum: ['Chef', 'Waiter', 'Owner', 'Manager', 'Assistant Manager'],
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
    userName: {
        type: String,
        required: true,
        unique: true // Ensures that username is unique across all documents
    },
    password: {
        type: String,
        required: true
    },

});

personSchema.pre('save', async function (next) {
    // Hash the password before saving the person document
    if (this.isModified('password')) {
        // Check if the password field is modified
        // This prevents re-hashing the password if it hasn't changed 
        try {
            const salt = await bcrypt.genSalt(10); // Generate a salt
            this.password = await bcrypt.hash(this.password, salt); // Hash the password
            next(); // Proceed to save the document
        } catch (error) {
            return next(error); // Pass any error to the next middleware
        }
    } else {
        next(); // If password is not modified, proceed to save
    }
});

personSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password); //this.password refers to the hashed password stored in the document
        // Compare the candidate password with the hashed password

        return isMatch; // Return true if passwords match, false otherwise
    }
    catch (error) {
        throw error;
    }
}

// Create the model from the schema
const Person = mongoose.model('Person', personSchema);
module.exports = Person;
