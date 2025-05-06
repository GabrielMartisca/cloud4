const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const app = express();

app.use(express.json());

app.use(express.static('public'));


const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
    .then(() => console.log('Connected to Cosmos DB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Explicitly use the 'cars' collection
const Item = mongoose.model('Item', new mongoose.Schema({
    name: String
}), 'cars');


const translateKey = process.env.TRANSLATOR_KEY;
const translateEndpoint = process.env.TRANSLATOR_ENDPOINT;





app.use(express.json());

const translatorKey = process.env.TRANSLATOR_KEY;
const translatorEndpoint = process.env.TRANSLATOR_ENDPOINT;
const translatorRegion = process.env.TRANSLATOR_REGION;

async function translateText(text, toLang) {
    const url = `${translatorEndpoint}/translate?api-version=3.0&to=${toLang}`;

    const response = await axios.post(url, [{ Text: text }], {
        headers: {
            'Ocp-Apim-Subscription-Key': translatorKey,
            'Ocp-Apim-Subscription-Region': translatorRegion,
            'Content-Type': 'application/json'
        }
    });

    return response.data;
}

app.post('/translate', async (req, res) => {
    const { text, to } = req.body;

    if (!text || !to) {
        return res.status(400).json({ error: 'Missing "text" or "to" in request body' });
    }

    try {
        const translationResult = await translateText(text, to);
        res.json(translationResult);
    } catch (err) {
        console.error('Translation error:', err.response ? err.response.data : err.message);
        res.status(500).json({ error: 'Translation failed' });
    }
});






const axios = require('axios');

const endpoint = process.env.COMPUTER_VISION_ENDPOINT;
const key = process.env.COMPUTER_VISION_KEY;

async function analyzeImage(imageUrl) {
    const url = `${endpoint}/vision/v3.2/analyze?visualFeatures=Description`;
    const response = await axios.post(url, { url: imageUrl }, {
        headers: {
            'Ocp-Apim-Subscription-Key': key,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}




app.post('/analyze', async (req, res) => {
    const { imageUrl } = req.body;
    if (!imageUrl) {
        return res.status(400).send('imageUrl is required');
    }

    try {
        const result = await analyzeImage(imageUrl);
        const description = result.description?.captions?.[0]?.text || 'No description found';

        const item = new Item({
            name: description
        });
        await item.save();

        res.json({
            message: 'Analysis saved to database',
            savedItem: item
        });
    } catch (err) {
        console.error('Error analyzing or saving:', err);
        res.status(500).send('Error analyzing image or saving to database');
    }
});




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
