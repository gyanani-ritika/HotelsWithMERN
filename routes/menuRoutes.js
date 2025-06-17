const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const { route } = require('./personRoutes');

router.post('/', async (req, res) => {
    try {
        const data = req.body
        const newMenuItem = new MenuItem(data);
        const savedMenuItem = await newMenuItem.save();
        console.log('Menu item created');
        res.status(200).json(savedMenuItem);
    } catch (error) {
        console.error('Error creating menu item:', error);
        res.status(500).json({ error: 'Failed to create menu item' });
    }
})

router.get('/', async (req, res) => {
    try {
        const data = await MenuItem.find();
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
})

router.get('/:tasteType', async (req, res) => {
    try {
        const tasteType = req.params.tasteType;
        const data = await MenuItem.find({ taste: tasteType });
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ error: 'Failed to fetch menu items' });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const menuItemId = req.params.id;
        const updatedData = req.body;
        const response = await MenuItem.findByIdAndUpdate(menuItemId, updatedData, {
            new: true,
            runValidators: true,
        });

        if (!response) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.status(200).json(response);
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ error: 'Failed to update menu item' });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const menuItemId = req.params.id;
        const response = await MenuItem.findByIdAndDelete(menuItemId);

        if (!response) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ error: 'Failed to delete menu item' });
    }
})

module.exports = router;