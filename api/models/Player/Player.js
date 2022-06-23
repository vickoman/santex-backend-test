const mongoose = require('mongoose');

const PlayerSchema =  mongoose.Schema({
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
    position: {
        type: String,
        required: false,
        trim: true
    },
    dateOfBirth: {
        type: Date,
        required: false,
        trim: true,
    },
    countryOfBirth: {
        type: String,
        required: false, // Required
        trim: true
    },
    nationality: {
        type: String,
        required: false,
        trim: true
    },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }
});

module.exports = mongoose.model('Player', PlayerSchema);
