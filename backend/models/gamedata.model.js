const mongoose = require('mongoose')

const CardInPlaySchema = new mongoose.Schema({
    playby: {
        type: mongoose.Schema.Types.ObjectId, // Reference to a User model
        ref: 'user',
        required: true,
    },
    id: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

const gameDataSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'game',
        required: true
    },

    cardsInPlay: [CardInPlaySchema],

    winner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true,
    },
    round: {
        type: Number,
        required: true
    },
    gameNumber: {
        type: Number,
        required: true
    }
}, {
    timestamps: true, 
})

const gameDataModel = mongoose.model('gameData', gameDataSchema);

module.exports = gameDataModel;