require('dotenv').config();

const status = require('./config/statusCodes');
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbCn');
const PORT = process.env.PORT || 3500;

//  Connect to MongoDB to access funFacts for states
connectDB();

//  Implement Cross Origin Resource Sharing control
app.use(cors());

//  Implement JSON functionality
app.use(express.json());

//  Serve static files to enable use of CSS, etc.
app.use('/', express.static(path.join(__dirname, '/public')));

//  Routes
app.use(('/', require('./routes/root')));
app.use('/states/', require('./routes/api/states'));

//  'Catch=all' for non-existent pages, or URI errors
app.all('*', (req, res) => {
    res.status(status.Not_Found);

    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

mongoose.connection.once('open', () => {
    console.log('\n============================\n')
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}\n`));
})
