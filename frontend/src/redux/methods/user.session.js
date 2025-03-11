// sessionUtils.js

const USER_SESSION_KEY = 'token';
const USER_EXPIRY_KEY = 'tokenExpiry';

// Set session with data and a 24-hour expiry
export const setUserSession = (data) => {
    const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(data));
    localStorage.setItem(USER_EXPIRY_KEY, expiryTime.toString());
};

export const getUserSession = () => {
    const expiryTime = parseInt(localStorage.getItem(USER_EXPIRY_KEY), 10);
    const currentTime = new Date().getTime();

    if (currentTime > expiryTime) {
        clearUserSession(); 
        return null;
    }

    const sessionData = localStorage.getItem(USER_SESSION_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
};

// Clear session
export const clearUserSession = () => {
    localStorage.removeItem(USER_SESSION_KEY);
    localStorage.removeItem(USER_EXPIRY_KEY);
};

const COMPANY_SESSION_KEY = 'org';
const COMPANY_EXPIRY_KEY = 'orgExpiry';

// Set session with data and a 24-hour expiry
export const setCompanySession = (data) => {
    const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
    localStorage.setItem(COMPANY_SESSION_KEY, JSON.stringify(data));
    localStorage.setItem(COMPANY_EXPIRY_KEY, expiryTime.toString());
};

export const getCompanySession = () => {

    const user = getUserSession() ?? JSON.parse(localStorage.getItem(USER_SESSION_KEY))?.user
    
    if(!user?.user?.id){
        clearCompanySession();
    }
    const expiryTime = parseInt(localStorage.getItem(COMPANY_EXPIRY_KEY), 10);
    const currentTime = new Date().getTime();
    
    if (currentTime > expiryTime) {
        clearUserSession(); 
        return null;
    }

    const sessionData = localStorage.getItem(COMPANY_SESSION_KEY);

    return sessionData ? JSON.parse(sessionData) : null;
};

// Clear session
export const clearCompanySession = () => {
    localStorage.removeItem(COMPANY_SESSION_KEY);
    localStorage.removeItem(COMPANY_EXPIRY_KEY);
};

