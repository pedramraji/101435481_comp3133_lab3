const express = require('express');
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');

const app = express();
const port = 3000;

mongoose.connect("mongodb+srv://pedramraji:1Hyom38guD9JEDXy@cluster0.dxzep.mongodb.net/3133?retryWrites=true&w=majority&appName=Cluster0", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


app.use(express.json());


app.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch restaurants' });
    }
});


app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
    try {
        const { cuisine } = req.params;
        const restaurants = await Restaurant.find({ cuisine });
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch restaurants by cuisine' });
    }
});


app.get('/restaurants', async (req, res) => {
    const { sortBy } = req.query;

    const sortOrder = sortBy === 'ASC' ? 1 : -1;

    try {
        const restaurants = await Restaurant.find()
            .select('cuisine name city restaurant_id')
            .sort({ restaurant_id: sortOrder });

        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch sorted restaurants' });
    }
});


app.get('/restaurants/Delicatessen', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({
            cuisine: 'Delicatessen',
            city: { $ne: 'Brooklyn' }
        })
            .select('cuisine name city')
            .sort({ name: 1 });

        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch restaurants with specific conditions' });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
