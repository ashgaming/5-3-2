import { SETUP_SOCKET_ERROR, SETUP_SOCKET_REQUEST, SETUP_SOCKET_RESET, SETUP_SOCKET_SUCCESS } from '../constants/socket.constants';


export const SocketReducer = (state = {loading : false , error : null , socket: null, sendMessage: null, receiveMessage: null }, action) => {
        switch (action.type) {
            case SETUP_SOCKET_REQUEST:
                return { loading: true, error: false };
            case SETUP_SOCKET_SUCCESS:
                return { ...state, loading: false, socket: action.payload , sendMessage:action.payload.sendMessage , receiveMessage:action.payload.receiveMessage ,  error: false };
            case SETUP_SOCKET_ERROR:
                return { ...state, loading: false, success: false, error: action.payload };
            case SETUP_SOCKET_RESET:
                return { ...state, loading : false , error : null , socket: null, sendMessage: null, receiveMessage: null };
            default:
                return state;
        }
};
