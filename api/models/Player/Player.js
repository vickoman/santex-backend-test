const mongoose = require('mongoose');

const PlayerSchema =  mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: false,
        trim: true
    },
    dateOfBirth: {
        type: String,
        required: false,
        trim: true,
        unique: true
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
