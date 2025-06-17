const express = require('express');
const router = express.Router();
const Person = require('../models/Person');

//add a new person
router.post('/', async (req, res) => {
    try {
        const data = req.body // Get the person data from the request body
        const newPerson = new Person(data); // Create a new instance of the Person model with the data
        const savedPerson = await newPerson.save(); // Save the new person to the database
        //await is used to wait for the save operation to complete
        console.log('Person created');
        res.status(200).json(savedPerson);


    } catch (error) {
        console.error('Error creating person:', error);
        res.status(500).json({ error: 'Failed to create person' });
    }
})

// Get all persons
router.get('/', async (req, res) => {
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