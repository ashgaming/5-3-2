import React, { createContext, useEffect } from 'react';
import io from 'socket.io-client';
import Context_User from './users.context';

// Create the Socket Context
export const SocketContext = createContext();
export const BACKEND_URL = import.meta.env.VITE_REACT_BACKEND_URL ? import.meta.env.VITE_REACT_BACKEND_URL : 'http://localhost:4000'

//const { email } = Context_User();

// Initialize the socket instance globally (singleton)
const socket = io(BACKEND_URL, {
    transports: ['websocket'], // Force WebSocket transport
    withCredentials: false,
});

export const SocketProvider = ({ children }) => {
    useEffect(() => {
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
    }, [email]);

    // Utility functions for sending and receiving messages
    const sendMessage = (eventName, message) => {

        console.log(`sending message: ${message.userType} to ${eventName} ` )

        socket.emit(eventName, message);
    };

    const receiveMessage = (eventName, callback) => {
        socket.on(eventName, callback);
    };

    return (
        <SocketContext.Provider value={{ socket, sendMessage, receiveMessage }}>
            {children}
        </SocketContext.Provider>
    );
};
