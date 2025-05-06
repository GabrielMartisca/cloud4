const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// Replace with your connection string
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    console.error('MONGO_URI environment variable is not set.');
    process.exit(1);
}

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to Cosmos DB!'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a simple model
const Item = mongoose.model('Item', new mongoose.Schema({
    name: String
}));

// Route to add an item
app.post('/items', async (req, res) => {
    const item = new Item({ name: req.body.name });
    await item.save();
    res.json(item);
});

// Route to get all items
app.get('/items', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
