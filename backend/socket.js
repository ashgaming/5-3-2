const socketIo = require('socket.io');
const userModel = require('./models/users.models');
const gameServices = require('./services/game.services')


let io;


function initializeSocket(server) {
    // Attach socket.io to the server
    io = socketIo(server, {
        cors: {
            origin: 'http://localhost:5173', // Replace with your frontend URL
            methods: ['GET', 'POST'],
        },
    });

    const emailToSocketMapping = new Map();
    const socketToEmailMapping = new Map();
    const isUserReadyGetByRoomId = new Map();
    const emailToUserIdMapping = new Map();
    const userIdToEmailMapping = new Map();

    // Set up event listeners
    io.on('connection', async (socket, data) => {

        // Handle the 'join' event

        socket.on('join', async (data) => {
            try {

                console.log('data', data)

                if (!data || !data.userId) {
                    console.error('Invalid data received for "join" event:', data);
                    socket.emit('error', { message: 'Invalid join data' });
                    return;
                }

                const { userId } = data;
                const user = await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                const email = user.email;
                emailToSocketMapping.set(email, socket.id);
                socketToEmailMapping.set(socket.id, email);
                emailToUserIdMapping.set(email,userId)
                userIdToEmailMapping.set(userId,email)
                console.error(`user ${userId} connected to socket id : ${socket.id}`);
            } catch (error) {
                console.error('Error handling "join" event:', error.message);
                socket.emit('error', { message: 'Server error during join event' });
            }
        });

        socket.on('update-location-user', async (data) => {
            const { userId, location } = data;

            if (!location || !location.ltd || !location.log) {
                return socket.emit('error', { message: 'Invalid Location' })
            }

            console.log(`user: ${userId} , updated location to ${location} `)
            await userModel.findByIdAndUpdate(userId, { location });


        })

        socket.on('join-room', async (data) => {
            try {

                if (!data || !data.userId || !data.email) {
                    console.error('Invalid data received for "join" event:', data);
                    socket.emit('error', { message: 'Invalid join room data' });
                    return;
                }

                const { userId, email, roomId } = data;
                socket.join(roomId);
                emailToSocketMapping.set(email, socket.id);
                socketToEmailMapping.set(socket.id, email);
                const existingUsers = isUserReadyGetByRoomId.get(roomId) || [];
                const updatedUsers = isUserReadyGetByRoomId.set(roomId, [
                    ...existingUsers,
                    {
                        email: email,
                        isReady: false,
                    }
                ]

                );
                const users = isUserReadyGetByRoomId.get(roomId) || [];
                socket.broadcast.to(roomId).emit('user-joined', { users })
                socket.emit('user-joined', { users })
                socket.emit('joined-room', { roomId })
                console.error(`user ${email} joined room to ${roomId}`);
            } catch (error) {
                console.error('Error handling "join" event:', error.message);
                socket.emit('error', { message: 'Server error during join event' });
            }
        });

        socket.on('start-game', async (data) => {
            try {
                const { userId, email, roomId } = data;
                const currentUsers = isUserReadyGetByRoomId.get(roomId) || [];

                // Update the specific user's ready status
                const updatedUsers = currentUsers.map(userObj => {
                    if (userObj.email === email) {
                        return { ...userObj, isReady: true };
                    }
                    return userObj;
                });

                // Update the Map
                isUserReadyGetByRoomId.set(roomId, updatedUsers);

                // Step 2: Check if all players are ready
                const allReady = updatedUsers.length === 2 ? updatedUsers.every(player => player.isReady) : false;

                if(!allReady){
                    return;
                }

                const rooms = io.sockets.adapter.rooms.get(roomId);
                // Check if rooms exists and has the expected number of players
                if (!rooms || rooms.size < 2) {
                    throw new Error('Insufficient players in room');
                }

                // Convert Set to Array and create playerList
                const roomArray = Array.from(rooms);
                const playerList = roomArray.slice(0, 3).map((socketId, index) => ({
                    email: socketToEmailMapping.get(socketId),
                    socketId: socketId,
                    userId : emailToUserIdMapping.get(socketToEmailMapping.get(socketId))
                }));

                const game = await gameServices.CreateGame({
                    roomId,
                    playerList
                });
        
                // Emit to all clients in room including sender
                const gameId = game.game?._id;
                socket.to(roomId).emit('game-started', { gameId})
                socket.emit('game-started', { gameId })


            } catch (error) {
                console.log(error.message)
            }
        })

        socket.on('call-user', (data) => {
            const { email, offer } = data;
            const from = socketToEmailMapping.get(socket.id)
            const socketId = emailToSocketMapping.get(email);
            socket.to(socketId).emit('incoming-call', { from, offer })
        });

        socket.on('call-accepted', (data) => {
            const { email, ans } = data;
            const from = socketToEmailMapping.get(socket.id)
            const socketId = emailToSocketMapping.get(email);
            socket.to(socketId).emit('call-accepted', { ans })
            socket.to(socketId).emit(
                'new-player-join-room',
                {
                    email: from
                }
            )
            socket.emit(
                'new-player-join-room',
                {
                    email
                }
            )

        });


        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });

        socket.on('joinRoom', (socket, roomName) => {
            socket.join(roomName); // Join the specified room
            console.log(`${socket.id} joined room: ${roomName}`);

            // Update rooms map
            if (!rooms.has(roomName)) {
                rooms.set(roomName, new Set());
            }
            rooms.get(roomName).add(socket.id);

            // Notify the user they’ve joined
            socket.emit('message', `You joined room: ${roomName}`);

            // Notify others in the room
            socket.to(roomName).emit('message', `User ${socket.id} joined the room ${roomId}`);

            // Send the list of users in the room to the client
            const usersInRoom = Array.from(rooms.get(roomName));
            io.to(roomName).emit('roomUsers', usersInRoom);
        });

        // Handle messages sent to a room
        socket.on('roomMessage', ({ roomName, message, socket }) => {
            console.log(`Message in ${roomName}: ${message}`);
            socket.to(roomName).emit('message', `${socket.id}: ${message}`); // Broadcast to room
        });

        // Handle leaving a room
        socket.on('leave-Room', (roomName) => {
            socket.leave(roomName);
            console.log(`${socket.id} left room: ${roomName}`);

            // Update rooms map
            if (rooms.has(roomName)) {
                rooms.get(roomName).delete(socket.id);
                if (rooms.get(roomName).size === 0) {
                    rooms.delete(roomName); // Remove empty room
                }
            }

            // Notify others in the room
            socket.to(roomName).emit('message', `User ${socket.id} left the room`);

            // Update user list
            const usersInRoom = rooms.has(roomName) ? Array.from(rooms.get(roomName)) : [];
            socket.to(roomName).emit('roomUsers', usersInRoom);
        });
    });



}

/**
 * Send a message to a specific socket ID.
 * @param {string} socketId - The socket ID to send the message to.
 * @param {Object|string} message - The message to send.
 */
function sendMessageToSocketId(socketId, messageObject) {
    if (!io) {
        console.error('Socket.io instance is not initialized');
        return { success: false, error: 'Socket.io instance is not initialized' };
    }

    if (!socketId) {
        console.error('Invalid socket ID');
        return { success: false, error: 'Invalid socket ID' };
    }

    try {
        io.to(socketId).emit(messageObject.event, messageObject.data);
        console.log(`Message sent to socketId: ${socketId} for event ${messageObject.event}`);
        return { success: true };
    } catch (error) {
        console.error('Error sending message:', error.message);
        return { success: false, error: error.message };
    }
}

function sendMessageToRoomId(roomId, messageObject) {
    if (!io) {
        console.error('Socket.io instance is not initialized');
        return { success: false, error: 'Socket.io instance is not initialized' };
    }

    if (!roomId) {
        console.error('Invalid socket ID');
        return { success: false, error: 'Invalid socket ID' };
    }

    try {

        console.log()
        io.to(roomId).emit(messageObject.event, messageObject.data);
        console.log(`Message sent to roomId: ${roomId} for event ${messageObject.event}`);
        return { success: true };
    } catch (error) {
        console.error('Error sending message:', error.message);
        return { success: false, error: error.message };
    }
}

module.exports = { initializeSocket, sendMessageToSocketId , sendMessageToRoomId };
