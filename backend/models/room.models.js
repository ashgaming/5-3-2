const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to a User model (assumed)
    ref: 'User', // Assuming you have a User model; adjust if needed
    required: true,
  },
  socketId: {
    type: String,
    required: true,
    min: 0,
  },
  isReady: {
    type : Boolean,
    default : false
  }
});


const roomSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: ['waiting', 'full', 'playing', 'finished'],
        required: true,
        minlength: [4, 'status must be  String']
    },
    password: {
        type: String,
        required: false,
        select: false,
    },
    players: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 3,
    },
    playerList:{
        type: Array,
        default:[playerSchema],
        nullable: true,
    },
    socketId: {
        type: String,
    }
})

const roomModel = mongoose.model('rooms', roomSchema);

module.exports = roomModel;