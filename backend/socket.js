const socketIo = require('socket.io');
const userModel = require('./models/users.models');


let io;


function initializeSocket(server) {
    // Attach socket.io to the server
    io = socketIo(server, {
        cors: {
            origin: 'http://localhost:5173', // Replace with your frontend URL
            methods: ['GET', 'POST'],
        },
    });

    // Set up event listeners
    io.on('connection', async(socket, data) => {

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
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
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


        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('A user disconnected:', socket.id);
        });
    });


    io.on('joinRoom', (socket, roomName) => {
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
        socket.to(roomName).emit('message', `User ${socket.id} joined the room`);

        // Send the list of users in the room to the client
        const usersInRoom = Array.from(rooms.get(roomName));
        io.to(roomName).emit('roomUsers', usersInRoom);
    });

    // Handle messages sent to a room
    io.on('roomMessage', ({ roomName, message, socket }) => {
        console.log(`Message in ${roomName}: ${message}`);
        io.to(roomName).emit('message', `${socket.id}: ${message}`); // Broadcast to room
    });

    // Handle leaving a room
    io.on('leaveRoom', (roomName) => {
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
        io.to(roomName).emit('message', `User ${socket.id} left the room`);

        // Update user list
        const usersInRoom = rooms.has(roomName) ? Array.from(rooms.get(roomName)) : [];
        io.to(roomName).emit('roomUsers', usersInRoom);
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

module.exports = { initializeSocket, sendMessageToSocketId };
