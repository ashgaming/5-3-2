// reducers/authReducer.js
import {
    REGISTER_USER_REQUEST, REGISTER_USER_SUCCESS, REGISTER_USER_ERROR, REGISTER_USER_RESET,
    LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_ERROR, LOGIN_USER_RESET,
    DATA_USER_REQUEST, DATA_USER_SUCCESS, DATA_USER_ERROR, DATA_USER_RESET,

} from "../constants/user.constant";

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
};
const userLoginInitial = { loading: false, success: false, error: false, token: null }

export const userLoginReducer = (state = userLoginInitial, action) => {
    switch (action.type) {
        case LOGIN_USER_REQUEST:
            return { loading: true, success: false, error: false };
        case LOGIN_USER_SUCCESS:
            return { ...state, loading: false, token: action.payload.token, success: true, error: false };
        case LOGIN_USER_ERROR:
            return { ...state, loading: false, success: false, error: action.payload };
        case LOGIN_USER_RESET:
            return { ...userLoginInitial };
        default:
            return state;
    }
};


export const userRegisterReducer = (state = userLoginInitial, action) => {
    switch (action.type) {
        case REGISTER_USER_REQUEST:
            return { loading: true, success: false, error: false };
        case REGISTER_USER_SUCCESS: // Handle successful registration
            return { ...state, loading: false, token: action.payload.token, success: true, error: false };
        case REGISTER_USER_ERROR: // Handle registration failure
            return { ...state, loading: false, success: false, error: action.payload };
        case REGISTER_USER_RESET: // Handle registration failure
            return { ...userLoginInitial };
        default:
            return state;
    }
};


export const userDataReducer = ( state =  { user : {} , loading: false, success: false, error: false } , action ) => {
    switch (action.type) {
        case DATA_USER_REQUEST:
            return { loading: true, success: false, error: false };
        case DATA_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload , success: true, error: false };
        case DATA_USER_ERROR:
            return { ...state, loading: false, success: false, error: action.payload };
        case DATA_USER_RESET:
            return { ...state, user : {} , loading: false, success: false, error: false };
        default:
            return state;
    }
};

