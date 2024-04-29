const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const factSchema = new Schema({
    stateCode: {
        type: String,
        required: true,
        unique: true
    },
    funfacts: []
});

module.exports = mongoose.model('Fact', factSchema);
