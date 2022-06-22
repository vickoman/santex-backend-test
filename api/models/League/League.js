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
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }]
});

module.exports = mongoose.model('League', LeagueSchema);
