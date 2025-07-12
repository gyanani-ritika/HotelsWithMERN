const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
const { use } = require('passport');

//signup a new person with JWT token generation
router.post('/signup', async (req, res) => {
    try {
        const data = req.body // Get the person data from the request body
        const newPerson = new Person(data); // Create a new instance of the Person model with the data
        const savedPerson = await newPerson.save(); // Save the new person to the database
        console.log('Person created');

        const payload = {
            id: savedPerson.id,
            userName: savedPerson.userName,
        }
        console.log('Payload for token:', payload);

        const token = generateToken(payload);// Generate a JWT token using the saved person's id and username
        console.log('Token generated:', token);
        res.status(200).json({ response: savedPerson, token: token });

    } catch (error) {
        console.error('Error creating person:', error);
        res.status(500).json({ error: 'Failed to create person' });
    }
})


//Login route with JWT token generation
router.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body; // Get username and password from request body
        const user = await Person.findOne({ userName }); // Find the person by username

        // If user is not found, return a 404 error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the password is correct
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // If login is successful, generate a JWT token
        const payload = {
            id: user.id,
            userName: user.userName,
        };
        const token = generateToken(payload);
        res.status(200).json({ token });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
});

//profile route to get the logged-in user's details
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user; // Get the user data from the JWT token
        console.log('User data from token:', userData);
        const user = await Person.findById(userData.id); // Find the user by ID

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user); // Send the user details as a JSON response
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});


// Get all persons
router.get('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const data = await Person.find(); // Fetch all persons from the database
        res.status(200).json(data); // Send the fetched persons as a JSON response
    } catch (error) {
        console.error('Error fetching persons:', error);
        res.status(500).json({ error: 'Failed to fetch persons' });
    }
})

// Get persons by work type
router.get('/:workType', async (req, res) => {
    try {
        const workType = req.params.workType;
        const data = await Person.find({ work: workType });
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching persons by work type:', error);
        res.status(500).json({ error: 'Failed to fetch persons by work type' });
    }
})

//Update a person by ID
router.put('/:id', async (req, res) => {
    try {
        const personId = req.params.id; // Get the person ID from the request parameters
        const updatedData = req.body; // Get the updated data from the request body
        const response = await Person.findByIdAndUpdate(personId, updatedData, {
            //findByIdAndUpdate is a mongoose method that finds a document by its ID and updates it
            new: true,// returns the updated or new document
            runValidators: true, // ensures validation rules are applied
        });
        // Update the person in the database

        if (!response) {
            return res.status(404).json({ error: 'Person not found' });
        }
        // If the person or id is not found, return a 404 error 

        console.log('Person updated');
        res.status(200).json(response);
    } catch (error) {
        console.error('Error updating person:', error);
        res.status(500).json({ error: 'Failed to update person' });
    }
})

// Delete a person by ID
router.delete('/:id', async (req, res) => {
    try {
        const personId = req.params.id; // Get the person ID from the request parameters
        const response = await Person.findByIdAndDelete(personId); // Delete the person by ID

        if (!response) {
            return res.status(404).json({ error: 'Person not found' });
        }
        // If the person or id is not found, return a 404 error 

        console.log('Person deleted');
        res.status(200).json({ message: 'Person deleted successfully' });
    } catch (error) {
        console.error('Error deleting person:', error);
        res.status(500).json({ error: 'Failed to delete person' });
    }
})

module.exports = router;