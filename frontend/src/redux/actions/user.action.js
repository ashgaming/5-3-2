import { DATA_USER_ERROR, DATA_USER_REQUEST, DATA_USER_RESET, DATA_USER_SUCCESS, LOGIN_USER_ERROR, LOGIN_USER_REQUEST, LOGIN_USER_RESET, LOGIN_USER_SUCCESS, REGISTER_USER_ERROR, REGISTER_USER_REQUEST, REGISTER_USER_RESET, REGISTER_USER_SUCCESS } from '../constants/user.constant';
import axios from 'axios'
import { clearUserSession, getUserSession, setUserSession } from '../methods/user.session';

export const BACKEND_URL = import.meta.env.VITE_REACT_BACKEND_URL ? import.meta.env.VITE_REACT_BACKEND_URL : 'http://localhost:4000'

export const getUserData = () => async (dispatch, navigate) => {

    const token = localStorage.getItem('token') ? getUserSession().token : null;
    try {

        dispatch({
            type: DATA_USER_RESET
        })

        dispatch({
            type: DATA_USER_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `bearer ${token}`
            },
        }

        const { data } = await axios.get(`${BACKEND_URL}/users/profile`,config)

        setUserSession(data)

        const date = new Date()
        dispatch({
            type: DATA_USER_SUCCESS,
            payload: {...data, creatdOn : date.toLocaleDateString()}
        })

    }
    catch (error) {
        dispatch({
            type: DATA_USER_ERROR,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })

        setTimeout(() => {
            dispatch({ type: DATA_USER_ERROR }); 
          }, 5000);
    }
}

export const userLogin = (fdata) => async (dispatch) => {

    try {


        dispatch({
            type: LOGIN_USER_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        console.log(`${BACKEND_URL}/users/login`)

        const { data } = await axios.post(`${BACKEND_URL}/users/login`,
            fdata,
            config)
            
       
        dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: data
        })

        setUserSession(data)

        dispatch(getUserData())

       
    }
    catch (error) {

        console.log(error)
        dispatch({
            type: LOGIN_USER_ERROR,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })

        setTimeout(() => {
            dispatch({ type: LOGIN_USER_RESET });
          }, 5000);
    }
}

export const userRegister = (fdata) => async (dispatch) => {
    try {
        dispatch({
            type: REGISTER_USER_REQUEST
        })

        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        const { data } = await axios.post(`${BACKEND_URL}/users/register`,
            fdata,
            config)

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data
        })

        localStorage.setItem('token', JSON.stringify(data))

        dispatch(getUserData())
    }
    catch (error) {
        dispatch({
            type: REGISTER_USER_ERROR,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        })

        console.log(error)

        setTimeout(() => {
            dispatch({ type: REGISTER_USER_RESET }); // Clear error in Redux
          }, 5000);
    }
}

export const logoutUser = () => async (dispatch) => {
    dispatch({ type: DATA_USER_RESET })
    dispatch({ type: REGISTER_USER_RESET })
    dispatch({ type: LOGIN_USER_RESET    })
    clearUserSession();
    // dispatch({type: LIST_MY_BOOKING_RESET})
    // localStorage.removeItem('MY_SUBSCRIPTION_LIST');
    // localStorage.removeItem('SUBSCRIPTION_PLAN_LIST');
    // localStorage.removeItem('activeWork');
    // localStorage.removeItem('mybooking');
    // localStorage.removeItem('subscriberInfo');
    // localStorage.removeItem('userAddress');

    return true;
}
