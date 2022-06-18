const mongoose = require('mongoose');

const LeagueSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        trim: true
    },
    areaName: {
        type: String,
        required: true,
        trim: true
    },
});

module.exports = mongoose.model('League', LeagueSchema);
