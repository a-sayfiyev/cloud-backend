require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB using environment variable with updated timeout settings
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000, // Set connect timeout to 30 seconds
    socketTimeoutMS: 45000  // Set socket timeout to 45 seconds
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB:', err.message));

// Define a schema for each form
const ItemSchema = new mongoose.Schema({
    formType: String,
    itemName: String
});

// Create a model from the schema
const Item = mongoose.model('Item', ItemSchema);

// Middleware to parse JSON bodies and allow CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: 'https://cloud-frontend-sayfiyev.vercel.app' // Allow only your frontend URL
}));

// Route handlers for the forms
app.post('/:formType', (req, res) => {
    const { formType } = req.params;
    const { itemName } = req.body;

    const newItem = new Item({ formType, itemName });
    newItem.save()
        .then(item => res.json(item))
        .catch(err => {
            console.error('Error saving item:', err); // Log the full error
            res.status(500).send("Error saving item to database: " + err.stack); // Send back the error stack
        });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
