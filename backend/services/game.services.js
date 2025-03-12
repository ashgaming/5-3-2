const gameModel = require('../models/game.models')
const roomModel = require('../models/room.models')
const gamedataModel = require('../models/gamedata.model')
const { sendMessageToSocketId } = require('../socket')
const redis = require('../redisClient')
const { Cards } = require('./cards.services')


module.exports.CreateRoom = async (
  { userId, socketId }
) => {
  try {
    const room = await roomModel.create({
      status: 'waiting',
      players: 1,
      playerList: [
        { userId, socketId, isReady: false }
      ]
    })

    await redis.set(`room-${room._id}`, JSON.stringify(room), 20000)

    return room
  } catch (error) {
    return null
  }
}

module.exports.JoinRoom = async (roomId, userId, socketId) => {
  try {
    const room = await roomModel.findOneAndUpdate(
      { _id: roomId, players: { $lt: 4 } },
      {
        $inc: { players: 1 },
        $push: { playerList: { userId, socketId, isReady: false } },
        $set: {
          status: (await roomModel.findOne({ _id: roomId }).lean())?.players + 1 === 3 ? 'full' : 'waiting'
        }
      },
      { new: true }
    );

    if (!room) {
      return null; // Room not found or full
    }

    await redis.set(`room-${room._id}`, JSON.stringify(room), 20000)

    if (room.playerList && room.playerList.length > 0) {
      room.playerList.forEach((player) => {
        if (player.userId) {

          sendMessageToSocketId(player.socketId,
            {
              event: 'new-player-join-room',
              data: room.playerList
            })

        }
      });
    }

    return room;
  } catch (error) {
    console.error("Error joining room:", error); // Use console.error for errors
    return null;
  }
};


module.exports.SendPlayerJoinNotification = async (roomId) => {
  try {
    const key = `room-${roomId}`;

    // Fix redis.get (it's async) and handle caching properly
    let room = JSON.parse(await redis.get(key));
    if (!room) {
      room = await roomModel
        .findOne({ _id: roomId })
        .populate('playerList.userId')
        .exec();

      if (!room) {
        return null;
      }

      // Store in redis only if fetched from DB
      await redis.set(key, JSON.stringify(room), 'EX', 20 * 60); // 20 minutes in seconds
    } else {
      room = JSON.parse(room); // Parse if retrieved from redis
    }

    // Check playerList properly before iterating
    if (!room.playerList || room.playerList.length === 0) {
      return null;
    }

    room.playerList.forEach((player) => {
      if (player.userId && player.socketId) { // Check socketId exists too
        sendMessageToSocketId(player.socketId, {
          event: 'new-player-join-room',
          data: room.playerList
        });
      }
    });


  } catch (error) {
    console.error("Error in SendPlayerJoinNotification:", error);
    return null;
  }
};

module.exports.LeaveRoom = async (roomId, userId, socketId) => {
  try {
    const room = await roomModel.findOneAndUpdate(
      { _id: roomId },
      {
        $inc: { players: -1 },
        $pull: { playerList: { userId: userId, socketId: socketId } }, // Correct $pull usage
        $set: {
          status: 'waiting'
        }
      },
      { new: true }
    );


    if (!room) {
      return null;
    }
    await redis.set(`room-${room._id}`, JSON.stringify(room), 20000)

    if (room.playerList.length === 0) {
      await roomModel.deleteOne({ _id: roomId });
      return null; // Or return a specific message indicating the room was deleted
    } else {
      if (room.playerList && room.playerList.length > 0) {
        room.playerList.forEach((player) => {
          if (player.userId) {

            sendMessageToSocketId(player.socketId,
              {
                event: 'new-player-join-room',
                data: room.playerList
              })

          }
        });
      }
    }

    return room;
  } catch (error) {
    console.error("Error leaving room:", error);
    return null;
  }
};

const shuffleArray = (array) => {
  // Fisher-Yates shuffle
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const dealCardsToPlayers = (cardsArray, numPlayers = 3, cardsPerPlayer = 10) => {
  const shuffledCards = shuffleArray([...cardsArray]);
  const dealtCards = [];

  for (let i = 0; i < numPlayers; i++) {
    const start = i * cardsPerPlayer;
    const end = start + cardsPerPlayer;
    dealtCards.push(shuffledCards.slice(start, end));
  }

  return dealtCards;
};

const createGamePlayers = (playerList, dealtCards) => {

  const target = [5, 3, 2]
  return playerList.map((player, index) => ({
    userId: player.userId,
    socketId: player.socketId,
    currentGameScore: 0,
    totalGameScore: 0,
    gameWin: 0, // Assuming this should be initialized as 0
    target: target[index],
    looseTo: null,
    winTo: null,
    cards: dealtCards[index] || [] // Fallback to empty array if no cards
  }));
};

module.exports.StartGame = async ({ userId, roomId }) => {
  try {
    // Step 1: Update player's ready status
    const room = await roomModel.findOneAndUpdate(
      {
        _id: roomId,
        "playerList.userId": userId
      },
      {
        $set: { "playerList.$.isReady": true }
      },
      { new: true }
    );

    if (!room) {
      throw new Error("Room not found or user not in room");
    }

    await redis.set(`room-${room._id}`, JSON.stringify(room), 20000)

    // Step 2: Check if all players are ready
    const allReady = room.playerList.length === 3 ? room.playerList.every(player => player.isReady) : false;
    if (!allReady) {
      return { room, game: null, status: "waiting" };
    }

    // Step 3: Deal cards
    const cardsArray = Cards(); // Assuming Cards() returns an array of cards
    const dealtCards = dealCardsToPlayers(cardsArray, room.playerList.length);

    // Step 4: Create game document
    const game = await gameModel.create({
      roomId,
      master: userId,
      turnToPlay: userId,
      currentGameNumber: 1,
      totalGameNumber: 10,
      order: "unset",
      cardsInPlay: [],
      players: createGamePlayers(room.playerList, dealtCards)
    });

    if (room.playerList && room.playerList.length > 0) {
      room.playerList.forEach((player) => {
        if (player.userId) {

          sendMessageToSocketId(player.socketId,
            {
              event: 'game-started',
              data: game._id
            })

        }
      });
    }

    redis.set(`game-${game._id}`, JSON.stringify(game), 50000)

    return { room, game, status: "started" };

  } catch (error) {
    console.error("Error starting game:", error);
    return { room: null, game: null, status: "error", error: error.message };
  }
};

module.exports.EnterGame = async ({ gameId, userId }) => {
  try {
    let game = await getGameState({ gameId });

    if (!game) {
      console.log('hit here')
      return null;
    }

    const filteredGame = {
      ...game,
      players: game.players.map(player => ({
        userId: player.userId,
        socketId: player.userId == userId ? player.socketId : undefined, // Optional: hide socketId
        cards: String(player.userId) === String(userId) ? player.cards : [],
        currentGameScore: player.currentGameScore,
        totalGameScore: player.totalGameScore,
        gameWin: player.gameWin,
        target: player.target,
        looseTo: player.looseTo,
        winTo: player.winTo,
      }))
    };

    return filteredGame;
  } catch (error) {
    console.error("Error getting game data:", error);
    return null;
  }
};

module.exports.SetOrder = async ({ gameId, order }) => {
  try {
    const game = await gameModel.findOneAndUpdate(
      { _id: gameId },
      {
        order: order
      },
      { new: true }

    );

    if (!game) {
      return null;
    }

    await redis.set(`game-${game._id}`, JSON.stringify(game), 20000);

    const room = await getRoomData(game.roomId);

    console.log('room', room)

    if (room.playerList && room.playerList.length > 0) {
      room.playerList.forEach((player) => {
        if (player.userId) {

          sendMessageToSocketId(player.socketId,
            {
              event: 'order-set',
              data: game.order
            })

          sendMessageToSocketId(player.socketId,
            {
              event: 'getIsMyTern',
              data: game.turnToPlay
            })

        }
      });
    }

    return game.order;
  } catch (error) {
    console.error("Error getting game data:", error);
    return null;
  }
};


const FigureOutRoundWinner = async ({ cardInPlay = [], order, game }) => {
  try {
    if (!cardInPlay.length) return null;

    const cardsToCompare = cardInPlay.map((item) => { return { ...item, ...validateCard(item.card) } })

    const firstPlayCardType = cardsToCompare[0].type;

    const getHighestPriorityObject = (arr) => {
      if (!Array.isArray(arr) || arr.length === 0) return null;
      return arr.reduce((max, current) => {
        const currentPriority = Number(current.priority) || -Infinity;
        const maxPriority = Number(max.priority) || -Infinity;
        return currentPriority > maxPriority ? current : max;
      }, arr[0]);
    };

    // Check for order type first
    const orderCards = cardsToCompare.filter(item => String(item.type) === String(order));
    if (orderCards.length > 0) {
      const _card = getHighestPriorityObject(orderCards);
      const winnerPlayer = _card.playby;
      InsertInHistory({ cardsInPlay: cardsToCompare, gameId: game._id, round: game.round, gameNumber: game.currentGameNumber, winner: winnerPlayer })
      return { winnerPlayer, card: _card };
    }

    // Fallback to first card type
    const firstTypeCards = cardsToCompare.filter(item => String(item.type) === String(firstPlayCardType));

    if (firstTypeCards.length > 0) {
      console.log('firstTypeCards')
      const _card = getHighestPriorityObject(firstTypeCards);
      const winnerPlayer = _card.playby;
      InsertInHistory({ cardsInPlay: cardsToCompare, gameId: game._id, round: game.round, gameNumber: game.currentGameNumber, winner: winnerPlayer })
      return { winnerPlayer, card: _card };
    }
  } catch (error) {
    console.log(error)
    throw Error(error);
  }
};

const InsertInHistory = async ({ cardsInPlay, gameId, round, gameNumber = 0, winner }) => {
  try {
    const playedCards = cardsInPlay.map(({ playby, id, type, number, image }) => ({
      playby,
      id,
      type,
      number,
      image,
    }));

    const insertInGameHistory = await gamedataModel.create({
      gameId,
      cardsInPlay: playedCards,
      round,
      gameNumber,
      winner,
    });

    await redis.set(`gamedataModel-${insertInGameHistory._id}`, JSON.stringify(insertInGameHistory))

    return insertInGameHistory;
  } catch (error) { // Changed 'err' to 'error' for clarity
    console.error("Error inserting game history:", error); // Log the error for debugging
    throw error; // Rethrow the error to be handled by the caller
  }
};

// Validation helper
const validateInputs = ({ gameId, userId, card }) => {
  if (!gameId || !userId || !card) {
    throw new Error('Missing required parameters: gameId, userId, or card');
  }
};

// Fetch game state
const getGameState = async ({ gameId }) => {
  const game = JSON.parse(await redis.get(`game-${gameId}`)) ?? await gameModel.findOne({ _id: gameId }).lean();

  if (!game) {
    throw new Error(`Game not found for gameId: ${gameId}`);
  }

  await redis.set(`game-${gameId}`, JSON.stringify(game), 20000)
  return game;
};

// Validate player list
const validatePlayerList = (playerList) => {
  if (!playerList || playerList.length !== 3) {
    throw new Error('Player list invalid or not exactly 3 players');
  }
  return playerList;
};

// Get next player in sequence
const getNextPlayer = (array, targetUserId) => {
  const currentIndex = array.findIndex(obj => obj.userId.toString() === String(targetUserId));
  if (currentIndex === -1) throw new Error(`userId ${targetUserId} not found`);
  return array[(currentIndex + 1) % 3];
};

// Update game with played card
const updateGameState = async (gameId, userId, card, Master) => {
  const update = {
    $push: {
      cardsInPlay: { playby: userId, card }
    },
    $pull: {
      "players.$[player].cards": { id: Number(card) }
    },
    ...(Master ? { $set: { turnToPlay: Master.userId } } : {})
  };

  const game = await gameModel.findOneAndUpdate(
    { _id: gameId },
    update,
    {
      new: true,
      lean: true,
      arrayFilters: [{ "player.userId": userId }]
    }
  );

  if (!game) {
    throw new Error(`Game not found for gameId: ${gameId}`);
  }

  await redis.set(`game-${game._id}`, JSON.stringify(game), 20000)
  return game;
};

// Validate played card
const validateCard = (card) => {
  const playedCard = Cards().find(item => Number(item.id) === Number(card));
  if (!playedCard) {
    throw new Error(`Invalid card ID: ${card}`);
  }

  return playedCard;
};

// Get room data
const getRoomData = async (roomId) => {
  let room;
  const redisRoom = JSON.parse(await redis.get(`room-${roomId}`));

  if (redisRoom) {
    room = redisRoom;
  } else {
    room = await roomModel.findOne({ id: roomId }).lean();
    if (room) {  // Add null check to prevent storing undefined
      await redis.set(`room-${roomId}`, JSON.stringify(room), 'EX', 20000);
    }
  }
  return room;
};

// Broadcast helper
const broadcastToPlayers = (room, event, data) => {
  room.playerList.forEach(({ userId: playerId, socketId }) => {
    if (playerId && socketId) {
      try {
        sendMessageToSocketId(socketId, { event, data });
      } catch (socketError) {
        console.error(`Failed to send ${event} to socket ${socketId}:`, socketError);
      }
    }
  });
};

const handleRoundCompletion = async (gameId, game, broadcastFn) => {

  const winner = await FigureOutRoundWinner({
    cardInPlay: game.cardsInPlay,
    order: game.order,
    game: game
  });


  setTimeout(() => {
    broadcastFn('WinnerOfPlay', winner);
  }, 5000);


  const gameUp = await gameModel.findOneAndUpdate(
    { _id: gameId },
    {
      $set: {
        round: this.round === 10 ? 1 : this.round + 1,
        currentGameNumber : this.round === 10 ? +1 : 1,
        cardsInPlay: [],
        // Reset all players' scores to 0 when round is 10
        ...(this.round === 10 && { "players.currentGameScore": 0 }),
        // Then set winner's score to 1
        "players.$[elem].currentGameScore": 1
      }
    },
    {
      new: true,
      lean: true,
      arrayFilters: [{ "elem.userId": winner.winnerPlayer }]
    }
  );

  broadcastFn('getIsMyTern', { master: winner.winnerPlayer });

  await redis.set(`game-${gameId}`, JSON.stringify(gameUp), 20000)

  return winner;
};

module.exports.figureOutWhoLoose = async ({ gameId }) => {
  const game = await gameModel.findById(gameId).populate('players.userId').exec();

  const playerData = game.players;

  if (!playerData || playerData.length !== 3) {
    throw new Error("Game must have exactly 3 players.");
  }

  const playerResults = playerData.map(player => ({
    userId: player.userId._id,
    name: player.userId.email,
    target: player.target,
    currentGameScore: player.currentGameScore,
    compared: player.currentGameScore - player.target,
    winto: [],
    looseTo: [],
  }));

  // Compare each player's compared value with the others
  for (let i = 0; i < playerResults.length; i++) {
    for (let j = 0; j < playerResults.length; j++) {
      if (i !== j) {
        if (playerResults[i].compared > playerResults[j].compared) {
          playerResults[i].winto.push({ player: playerResults[j].name, points: (playerResults[i].compared + playerResults[j].compared) * -1 });
          playerResults[j].looseTo.push({ player: playerResults[i].name, points: (playerResults[i].compared + playerResults[j].compared) });
          //  playerResults[j].compared = playerResults[j].compared - ( playerResults[i].compared - playerResults[j].compared )
        }
      }
    }
  }

  // Format the result as required
  const formattedResult = playerResults.map(player => ({
    [player.name]: {
      number: player.compared,
      target: player.target,
      currentGameScore: player.currentGameScore,
      winto: player.winto,
      looseTo: player.looseTo,
    },
  }));

  return formattedResult;

}

const updataGamePlayers = (playerList, dealtCards, round) => {

  const figureOutWhoLoose = figureOutWhoLoose(playerData);
  const fn = (round) => {
    const patterns = [
      [5, 3, 2],
      [3, 2, 5],
      [2, 5, 3],
    ];

    return patterns[(round - 1) % patterns.length];
  };
  const target = fn(round)
  return playerList.map((player, index) => ({
    userId: player.userId,
    socketId: player.socketId,
    currentGameScore: 0,
    totalGameScore: 0,
    gameWin: 0,
    target: target[index],
    looseTo: {
      user: '',
      points: 0
    },
    winTo: {
      user: '',
      points: 0
    },
    cards: dealtCards[index] || []
  }));
};

const StartNewGame = async ({ room, gameId, game, winner, round }) => {
  try {
    const update = {
      master: userId,
      turnToPlay: userId,
      currentGameNumber: +1,
      order: "unset",
      cardsInPlay: [],
      players: updataGamePlayers(room.playerList, dealtCards, round)
    };


    const gameUp = await gameModel.findByIdAndUpdate(
      {
        id: gameId
      },
      update
      , { new: true })

    await redis.set(`game-${gameId}`, JSON.stringify(gameUp), 20000)

  } catch (error) {
    throw new Error(error)
  }
}

module.exports.PlayMyCards = async ({ gameId, userId, card }) => {
  try {

    console.log('---------------------------------------------------------------------------------')
    console.log("played : \t", userId, '\t', card)
    console.log('---------------------------------------------------------------------------------')

    validateInputs({ gameId, userId, card });

    const currentGame = await getGameState({ gameId });
    const playerList = validatePlayerList(currentGame.players);

    const Master = currentGame.cardsInPlay.length !== 3
      ? getNextPlayer(playerList, userId)
      : undefined;

    const game = await updateGameState(gameId, userId, card, Master);
    const playedCard = validateCard(card);
    let roomId = currentGame.roomId
    const room = await getRoomData(roomId);

    const broadcast = (event, data) => broadcastToPlayers(room, event, data);

    broadcast('cardsInPlay', { cardsInPlay: game.cardsInPlay, _card: playedCard });

    if (game.cardsInPlay.length >= 3) {
      return await handleRoundCompletion(gameId, game, broadcast);
    } else {
      broadcast('getIsMyTern', { master: Master.userId });
    }

    return card;

  } catch (error) {
    console.error('Error in PlayMyCards:', error.message);
    return null;
  }
};

module.exports.FigureOutRoundWinner = FigureOutRoundWinner;


const clearRedis = async () => {
  try {
    await redis.flushDb();
    console.log('All keys removed from the current Redis database');

    return { success: true }
  } catch (err) {
    console.error('Error clearing Redis:', err);
    throw err; // Re-throw to allow calling code to handle it
  }
};

module.exports.test = clearRedis;
