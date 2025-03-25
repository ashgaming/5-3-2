import { SETUP_PEER_ERROR, SETUP_PEER_REQUEST, SETUP_PEER_RESET, SETUP_PEER_SUCCESS } from "../constants/peer.constants";


export const PeerReducer = (state = { loading: false, error: null, peer: null, createOffer: null, createAnswer: null, setRemoteAnswer: null }, action) => {
    switch (action.type) {
        case SETUP_PEER_REQUEST:
            return { loading: true, error: false };
        case SETUP_PEER_SUCCESS:
            return { ...state, loading: false, peer: action.payload.peer, createOffer: action.payload.createOffer, createAnswer: action.payload.createAnswer, setRemoteAnswer: action.payload.setRemoteAnswer, error: false };
        case SETUP_PEER_ERROR:
            return { ...state, loading: false, success: false, error: action.payload };
        case SETUP_PEER_RESET:
            return { ...state, loading: false, error: null, socket: null, sendMessage: null, receiveMessage: null };
        default:
            return state;
    }
};
