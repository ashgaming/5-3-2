import { AppDispatch } from "../actions/game.action";
import {
    MODIFY_PLAYERS_IN_ROOM, CREATE_ROOM_ERROR, CREATE_ROOM_REQUEST, CREATE_ROOM_RESET, CREATE_ROOM_SUCCESS, JOIN_ROOM_ERROR, JOIN_ROOM_REQUEST, JOIN_ROOM_RESET, JOIN_ROOM_SUCCESS, LEAVE_ROOM_ERROR, LEAVE_ROOM_REQUEST, LEAVE_ROOM_RESET, LEAVE_ROOM_SUCCESS, PLAY_MY_CARD_ERROR, PLAY_MY_CARD_REQUEST, PLAY_MY_CARD_RESET, PLAY_MY_CARD_SUCCESS, SET_ROOM_ID, START_GAME_ERROR, START_GAME_REQUEST, START_GAME_RESET, START_GAME_SUCCESS, SET_GAME_ID, GET_GAME_REQUEST, GET_GAME_SUCCESS, GET_GAME_ERROR, GET_GAME_RESET, CURRENT_GAME_DATA,
    SET_ORDER_REQUEST,
    SET_ORDER_SUCCESS,
    SET_ORDER_ERROR,
    SET_ORDER_RESET,
    SET_GAME_ORDER,
    SET_PLAY_TURN,
} from "../constants/game.constants";

export const startGameReducer = (state = {
    roomId: '',
    loading: false,
    error: false,
    success: false,
}, action) => {
    switch (action.type) {
        case START_GAME_REQUEST:
            return { loading: true, success: false, error: false };
        case START_GAME_SUCCESS:
            return { ...state, loading: false, roomId: action.payload, success: true, error: false };
        case START_GAME_ERROR:
            return { ...state, loading: false, success: false, error: action.payload };
        case START_GAME_RESET:
            return {
                roomId: [],
                loading: false,
                error: false,
                success: false,
            };
        default:
            return state;
    }
};

export const gameLogicReducer = (state = {
    mycards: [],
    loading: false,
    error: false,
    success: false,
}, action) => {
    switch (action.type) {
        case PLAY_MY_CARD_REQUEST:
            return { loading: true, success: false, error: false };
        case PLAY_MY_CARD_SUCCESS:
            return { ...state, loading: false, mycards: action.payload.token, success: true, error: false };
        case PLAY_MY_CARD_ERROR:
            return { ...state, loading: false, success: false, error: action.payload };
        case PLAY_MY_CARD_RESET:
            return {
                mycards: [],
                loading: false,
                error: false,
                success: false,
            };
        default:
            return state;
    }
};

export const ceateRoomReducer = (state = {
    roomId: undefined,
    loading: false,
    error: false,
    success: false,
}, action) => {
    switch (action.type) {
        case CREATE_ROOM_REQUEST:
            return { loading: true, success: false, error: false };
        case CREATE_ROOM_SUCCESS:
            AppDispatch({
                type: SET_ROOM_ID,
                payload: action.payload
            })
            return { ...state, loading: false, roomId: action.payload, success: true, error: false };
        case CREATE_ROOM_ERROR:
            return { ...state, loading: false, success: false, error: action.payload };
        case CREATE_ROOM_RESET:
            return { roomId: undefined, loading: false, error: false, success: false, };
        default:
            return state;
    }
};

export const joinRoomReducer = (state = {
    roomId: undefined,
    loading: false,
    error: false,
    success: false,
}, action) => {
    switch (action.type) {
        case JOIN_ROOM_REQUEST:
            return { loading: true, success: false, error: false };
        case JOIN_ROOM_SUCCESS:
            return { ...state, loading: false, roomId: action.payload, success: true, error: false };
        case JOIN_ROOM_ERROR:
            return { ...state, loading: false, success: false, error: action.payload };
        case JOIN_ROOM_RESET:
            return { roomId: undefined, loading: false, error: false, success: false, };
        default:
            return state;
    }
};

export const leaveRoomReducer = (state = {
    roomId: undefined,
    loading: false,
    error: false,
    success: false,
}, action) => {
    switch (action.type) {
        case LEAVE_ROOM_REQUEST:
            return { loading: true, success: false, error: false };
        case LEAVE_ROOM_SUCCESS:
            return { ...state, loading: false, roomId: undefined, success: true, error: false };
        case LEAVE_ROOM_ERROR:
            return { ...state, loading: false, success: false, error: action.payload };
        case LEAVE_ROOM_RESET:
            return { roomId: undefined, loading: false, error: false, success: false, };
        default:
            return state;
    }
};

export const getInitialGame = (state = {
    game: {},
    loading: false,
    error: false,
    success: false,
}, action) => {
    switch (action.type) {
        case GET_GAME_REQUEST:
            return { loading: true, success: false, error: false };
        case GET_GAME_SUCCESS:
            return { ...state, loading: false, game: action.payload, success: true, error: false };
        case GET_GAME_ERROR:
            return { ...state, loading: false, success: false, error: action.payload };
        case GET_GAME_RESET:
            return { game: {}, loading: false, error: false, success: false, };
        default:
            return state;
    }
};

export const setOrderReducer = (state = {
    order: undefined,
    loading: false,
    error: false,
    success: false,
}, action) => {
    switch (action.type) {
        case SET_ORDER_REQUEST:
            return { loading: true, success: false, error: false };
        case SET_ORDER_SUCCESS:
            return { ...state, loading: false, order: undefined, success: true, error: false };
        case SET_ORDER_ERROR:
            return { ...state, loading: false, success: false, error: action.payload };
        case SET_ORDER_RESET:
            return { order: undefined, loading: false, error: false, success: false, };
        default:
            return state;
    }
};

export const playCardReducer = (state = {
    order: undefined,
    loading: false,
    error: false,
    success: false,
}, action) => {
    switch (action.type) {
        case SET_ORDER_REQUEST:
            return { loading: true, success: false, error: false };
        case SET_ORDER_SUCCESS:
            return { ...state, loading: false, order: undefined, success: true, error: false };
        case SET_ORDER_ERROR:
            return { ...state, loading: false, success: false, error: action.payload };
        case SET_ORDER_RESET:
            return { order: undefined, loading: false, error: false, success: false, };
        default:
            return state;
    }
};

export const RoomDetailsReducer = (state = {
    roomId: undefined,
    gameId: undefined,
    players: [],
    game: undefined,
    order: 'unset'
}, action) => {
    switch (action.type) {
        case SET_ROOM_ID:
            return { ...state, roomId: action.payload, };
        case MODIFY_PLAYERS_IN_ROOM:
            return { ...state, players: action.payload, };
        case SET_GAME_ID:
            return { ...state, gameId: action.payload, };
        case SET_GAME_ORDER:
            let updatedgame = state.game;
            updatedgame.order = action.payload
            console.log(updatedgame)
            return { ...state, order: action.payload, game: [updatedgame] };
        case CURRENT_GAME_DATA:
            return { ...state, game: action.payload }

        case SET_PLAY_TURN :
            return { ...state , playTurn : action.payload }
        default:
            return state;
    }
};