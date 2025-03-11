import { SETUP_SOCKET_ERROR, SETUP_SOCKET_REQUEST, SETUP_SOCKET_RESET, SETUP_SOCKET_SUCCESS } from '../constants/socket.constants';
import io from 'socket.io-client';
import { BACKEND_URL } from './user.action';

export const socket = io(`${BACKEND_URL}`, {
    transports: ['websocket'], // Force WebSocket transport
    withCredentials: false,
});;

export const setUpSocket = () => async (dispatch) => {
    
    try {

        dispatch({
            type: SETUP_SOCKET_REQUEST
        })
    
        // Add event listeners for connection and disconnection
        socket.on('connect', () => {
            console.log('Connected to WebSocket:', socket.id);
        });

        socket.on('disconnect', (reason) => {
            console.warn('Disconnected from WebSocket:', reason);
        });

        // Optional: Handle connection errors or reconnection attempts
        socket.on('connect_error', (error) => {
            console.error('Connection error:', error.message);
        });

        socket.on('reconnect_attempt', (attempt) => {
            console.log(`Reconnection attempt ${attempt}`);
        });

        // Cleanup listeners on unmount
        /*    return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            socket.off('reconnect_attempt');
            socket.disconnect(); // Disconnect the socket when unmounting
            };*/

        const sendMessage = (eventName, message) => {

            console.log(`sending message: ${message.userId} to ${eventName} `)

            socket.emit(eventName, message);
        };

        const receiveMessage = (eventName, callback) => {
            socket.on(eventName, callback);
        };


        dispatch({
            type: SETUP_SOCKET_SUCCESS,
            payload: {
                socket, sendMessage, receiveMessage
            }
        })
    } catch (error) {
        dispatch({
            type: SETUP_SOCKET_ERROR,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })

        setTimeout(() => {
            dispatch({ type: SETUP_SOCKET_RESET });
        }, 5000);
    }

}

export const sendMessage = (eventName, message) => {

    console.log(`sending message: ${message.userId} to ${eventName} `)

    socket.emit(eventName, message);
};

export const receiveMessage = (eventName, callback) => {
    console.log('hit here')

    socket.on(eventName, callback);
};