const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
    .then(() => console.log('Connected to Cosmos DB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Explicitly use the 'cars' collection
const Item = mongoose.model('Item', new mongoose.Schema({
    name: String
}), 'cars');

app.get('/', (req, res) => {
    res.json({ message: 'Hello, Azure from Node.js!' });
});

app.post('/items', async (req, res) => {
    const item = new Item({ name: req.body.name });
    await item.save();
    res.json(item);
});

app.get('/items', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
