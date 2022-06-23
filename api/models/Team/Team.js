const mongoose = require('mongoose');

const TeamSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: false,
        trim: true
    },
    tla: {
        type: String,
        required: false,
        trim: true
    },
    shortName: {
        type: String,
        required: true,
        trim: true
    },
    areaName: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: false,
        trim: true
    },
    leagues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'League' }],
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
});

module.exports = mongoose.model('Team', TeamSchema);
