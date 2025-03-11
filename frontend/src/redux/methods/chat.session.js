

// Set session with data and a 24-hour expiry
export const setChatSession = (chatId, data) => {
    const CHAT_SESSION_KEY = `chat_${chatId}`;

    // Retrieve existing array or initialize an empty one
    const existingEntries = JSON.parse(localStorage.getItem(CHAT_SESSION_KEY)) || [];

    // Add new entry to the array

    console.log('message session', data)
    existingEntries.push(data);

    // Save updated array back to localStorage
    localStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(existingEntries));
};

export const getUserSession = (chatId) => {
    const CHAT_SESSION_KEY = `chat_${chatId}`;

    // Retrieve existing data, or default to an empty object
    const existingData = JSON.parse(localStorage.getItem(CHAT_SESSION_KEY)) || {};

    return existingData;
};

// Clear session
export const clearUserSession = (chatId) => {
    const CHAT_SESSION_KEY = `chat_${chatId}`;
    localStorage.removeItem(CHAT_SESSION_KEY);
};