import { useNavigate } from "react-router-dom";
import { sendMessage } from './socket.action'
import {
    SET_ORDER_REQUEST,
    SET_ORDER_SUCCESS,
    SET_ORDER_ERROR,
    SET_ORDER_RESET,
    SET_GAME_ORDER,

    READY_TO_CONTINUE_REQUEST,
    READY_TO_CONTINUE_SUCCESS,
    READY_TO_CONTINUE_ERROR,
    READY_TO_CONTINUE_RESET,


    MODIFY_PLAYERS_IN_ROOM, CREATE_ROOM_ERROR, CREATE_ROOM_REQUEST, CREATE_ROOM_RESET, CREATE_ROOM_SUCCESS, JOIN_ROOM_ERROR, JOIN_ROOM_REQUEST, JOIN_ROOM_RESET, JOIN_ROOM_SUCCESS, LEAVE_ROOM_ERROR, LEAVE_ROOM_REQUEST, LEAVE_ROOM_RESET, LEAVE_ROOM_SUCCESS, PLAY_MY_CARD_ERROR, PLAY_MY_CARD_REQUEST, PLAY_MY_CARD_RESET, PLAY_MY_CARD_SUCCESS, SET_ROOM_ID, START_GAME_ERROR, START_GAME_REQUEST, START_GAME_RESET, START_GAME_SUCCESS, GET_GAME_REQUEST, GET_GAME_SUCCESS, GET_GAME_ERROR, GET_GAME_RESET, CURRENT_GAME_DATA,
    SET_GAME_ID
} from "../constants/game.constants";
import { BACKEND_URL } from "./user.action";
import axios from "axios";
import { getUserSession } from "../methods/user.session";

export const AppDispatch = ({ type, payload }) => async (dispatch) => {
    dispatch({ type, payload })
}

export const modifyplayerList = (data) => async (dispatch) => {
    console.log('MODIFY_PLAYERS_IN_ROOM',data)
    dispatch({ type: MODIFY_PLAYERS_IN_ROOM, payload: data })
}


export const startGame = (fdata) => async (dispatch) => {
    const token = localStorage.getItem('token') ? getUserSession().token : null;
    try {
        dispatch({
            type: START_GAME_REQUEST
        })

    /*    const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `bearer ${token}`
            }
        }

        const { data } = await axios.post(`${BACKEND_URL}/games/start`,
            fdata,
            config)


    */

        sendMessage('start-game',fdata)

        dispatch({
            type: START_GAME_SUCCESS,
            payload: ''
        })

    }
    catch (error) {
        dispatch({
            type: START_GAME_ERROR,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })

        console.log(error)

        setTimeout(() => {
            dispatch({ type: START_GAME_RESET }); // Clear error in Redux
        }, 5000);
    }
}

export const getGameData = (gameId) => async (dispatch) => {
    const token = localStorage.getItem('token') ? getUserSession().token : null;
    try {
        dispatch({
            type: GET_GAME_REQUEST
        })


        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `bearer ${token}`
            }
        }

        const { data } = await axios.post(`${BACKEND_URL}/games/enter`,
            { gameId },
            config)

        dispatch({
            type: GET_GAME_SUCCESS,
            payload: data
        })

        console.log('current game', data)

        dispatch({
            type: CURRENT_GAME_DATA,
            payload: data
        })

        dispatch({
            type: SET_GAME_ID,
            payload: data.game?._id
        })



    }
    catch (error) {
        dispatch({
            type: GET_GAME_ERROR,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })

        console.log(error)

        setTimeout(() => {
            dispatch({ type: GET_GAME_RESET }); // Clear error in Redux
        }, 5000);
    }
}

export const createRoom = ({socketId}) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token') ? getUserSession().token : null;
        dispatch({
            type: CREATE_ROOM_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `bearer ${token}`
            }
        }

        const { data } = await axios.post(`${BACKEND_URL}/games/room/create`, {socketId},
            config)

        dispatch({
            type: SET_ROOM_ID,
            payload: data.room._id
        })

        dispatch({
            type: CREATE_ROOM_SUCCESS,
            payload: data.room._id
        })

    }
    catch (error) {
        dispatch({
            type: CREATE_ROOM_ERROR,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })

        console.log(error)

        setTimeout(() => {
            dispatch({ type: CREATE_ROOM_RESET }); // Clear error in Redux
        }, 5000);
    }
}

export const joinRoom = (fdata) => async (dispatch) => {
    const token = localStorage.getItem('token') ? getUserSession().token : null;
    try {
        dispatch({
            type: JOIN_ROOM_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `bearer ${token}`
            }
        }

        const { data } = await axios.post(`${BACKEND_URL}/games/room/join`,
            fdata,
            config)

        dispatch({
            type: SET_ROOM_ID,
            payload: data.room._id
        })

        dispatch({
            type: JOIN_ROOM_SUCCESS,
            payload: ''
        })

    }
    catch (error) {
        dispatch({
            type: JOIN_ROOM_ERROR,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })

        console.log(error)

        setTimeout(() => {
            dispatch({ type: JOIN_ROOM_RESET }); // Clear error in Redux
        }, 5000);
    }
}

export const leaveRoom = (fdata) => async (dispatch) => {
    const token = localStorage.getItem('token') ? getUserSession().token : null;
    try {
        dispatch({
            type: LEAVE_ROOM_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `bearer ${token}`
            }
        }

        // const { data } = await axios.post(`${BACKEND_URL}/games/room/leave`,
        //     fdata,
        //     config)

        // sendMessage('',{

        // })

        dispatch({
            type: SET_ROOM_ID,
            payload: undefined
        })

        modifyplayerList([])

        dispatch({
            type: LEAVE_ROOM_SUCCESS,
            payload: ''
        })

    }
    catch (error) {
        dispatch({
            type: LEAVE_ROOM_ERROR,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })

        console.log(error)

        setTimeout(() => {
            dispatch({ type: LEAVE_ROOM_RESET }); // Clear error in Redux
        }, 5000);
    }
}

export const setOrder = (fdata) => async (dispatch) => {
    const token = localStorage.getItem('token') ? getUserSession().token : null;
    try {
        dispatch({
            type: SET_ORDER_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `bearer ${token}`
            }
        }

        const { data } = await axios.post(`${BACKEND_URL}/games/set/order`,
            fdata,
            config)

        dispatch({
            type: SET_ORDER_SUCCESS,
            payload: ''
        })
    }
    catch (error) {
        dispatch({
            type: SET_ORDER_ERROR,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })

        console.log(error)

        setTimeout(() => {
            dispatch({ type: SET_ORDER_RESET }); // Clear error in Redux
        }, 5000);
    }
}

export const playMyCards = (fdata) => async (dispatch) => {
    const token = localStorage.getItem('token') ? getUserSession().token : null;
    try {
        dispatch({
            type: PLAY_MY_CARD_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `bearer ${token}`
            }
        }

        const { data } = await axios.post(`${BACKEND_URL}/games/play-card`,
            fdata,
            config)


        dispatch({
            type: PLAY_MY_CARD_SUCCESS,
            payload: ''
        })
    }
    catch (error) {
        dispatch({
            type: PLAY_MY_CARD_ERROR,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })

        console.log(error)

        setTimeout(() => {
            dispatch({ type: PLAY_MY_CARD_RESET }); // Clear error in Redux
        }, 5000);
    }
}

export const continueToPlay = (fdata) => async (dispatch) => {
    const token = localStorage.getItem('token') ? getUserSession().token : null;
    try {
        dispatch({
            type: READY_TO_CONTINUE_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `bearer ${token}`
            }
        }

        const { data } = await axios.post(`${BACKEND_URL}/games/readytoplay`,
            fdata,
            config)

        dispatch({
            type: READY_TO_CONTINUE_SUCCESS,
            payload: Ready
        })

    }
    catch (error) {
        dispatch({
            type: READY_TO_CONTINUE_ERROR,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })

        console.log(error)

        setTimeout(() => {
            dispatch({ type: READY_TO_CONTINUE_RESET }); // Clear error in Redux
        }, 5000);
    }
}
