const mongoose = require('mongoose')


// Subschema for looseTo and winTo
const ScoreRelationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Reference to a User model (assumed)
    ref: 'user', // Assuming you have a User model; adjust if needed
    required: true,
  },
  points: {
    type: Number,
    required: true,
    min: 0,
  },
});

// Subschema for cards
const CardSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['club', 'diamond', 'spade', 'heart'], // Restrict to valid suits
    required: true,
  },
  number: {
    type: String,
    enum: ['ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'],
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

// Subschema for players
const PlayerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user',
    required: true,
  },
  socketId: {
    type: String,
    required: true,
  },
  currentGameScore: {
    type: Number,
    required: true,
    min: 0,
  },
  totalGameScore: {
    type: Number,
    required: true,
    min: 0,
  },
  gameWin: {
    type: Number,
    required: true,
    min: 0,
  },
  target: {
    type: Number,
    required: true,
    min: 0,
  },
  looseTo: {
    type: ScoreRelationSchema,
    default: null, // Optional field
  },
  winTo: {
    type: ScoreRelationSchema,
    default: null, // Optional field
  },
  cards: [CardSchema], 
});

// Subschema for cardsInPlay
const CardInPlaySchema = new mongoose.Schema({
  playby: {
    type: mongoose.Schema.Types.ObjectId, // Reference to a User model
    ref: 'User',
    required: true,
  },
  card: {
    type: Number, // Assuming card is identified by its id
    required: true,
  },
});

// Main Game Schema
const GameSchema = new mongoose.Schema({
  players: [PlayerSchema], // Array of players
  cardsInPlay: [CardInPlaySchema], // Array of cards in play
  order: {
    type: String,
    enum: ['club', 'diamond', 'spade', 'heart','unset'], // Corrected 'space' to 'spade'
    required: true,
  },
  master : {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  } , 
  turnToPlay : {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
  } , 
  currentGameNumber: {
    type: Number,
    required: true,
    min: 0,
  },
  totalGameNumber: {
    type: Number,
    required: true,
    min: 0,
  },
  roomId: {
    type: String,
    required: true,
   // unique: true, // Ensure roomId is unique
  },
  round:{
    type:Number,
    default:0
  }

}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create the model
const gameModel = mongoose.model('game', GameSchema);

module.exports = gameModel;



// game = {
//     players: [
//         {
//             userId: id,
//             socketId: socketId,
//             gamescore: 5,
//             gameWin: 5,
//             target: 2,
//             looseTo:
//             {
//                 user: userId,
//                 points: 1 // userIdofotherplayer 
//             },

//             winTo:
//             {
//                 user: userId,
//                 points: 1 // userIdofotherplayer 
//             },

//             cards: [
//                 { id: 0, type: 'club', number: 'ace', image: 'https://www.tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_ace.png' },
//                 { id: 7, type: 'club', number: '8', image: 'https://www.tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_8.png' },
//                 { id: 8, type: 'club', number: '9', image: 'https://www.tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_9.png' },
//                 { id: 9, type: 'club', number: '10', image: 'https://www.tekeye.uk/playing_cards/images/svg_playing_cards/fronts/png_96_dpi/clubs_10.png' },
//                 //  ...
//             ]

//         },
//         {
//             //...
//         },
//         {
//             //  ...
//         },

//     ]
//     ,
//     cardsInPlay: [
//         {
//             playby: userId,
//             card: cardid
//         }
//     ],
//     order: 'space',
//     gameNumber: 10,
//     totalGameNumber:20,
//     roomId: 'feiwefo'
// }