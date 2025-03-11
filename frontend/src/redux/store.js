import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './combineReducer';
import { getUserSession } from './methods/user.session';
//import { composeWithDevTools } from 'redux-devtools-extension'


const initialState = {
    UserData: {
        user: localStorage.getItem('token') ? getUserSession() : [],
        loading: false,
        error: null,
        success: false,
      },
};
const middleware = [thunk];



//during dev
// const store = createStore(rootReducer, initialState,
//     composeWithDevTools(applyMiddleware(...middleware),
//     ))
 
 // during production 
 const store = createStore(rootReducer, initialState,
    applyMiddleware(...middleware)) 
    /*
 */



export default store;