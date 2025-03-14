import { combineReducers } from 'redux';
import { userDataReducer, userLoginReducer, userRegisterReducer } from './reducers/user.reducer';
import { SocketReducer } from './reducers/socket.reducer';
import { createRoomReducer, joinRoomReducer, playCardReducer, RoomDetailsReducer, startGameReducer  } from './reducers/game.reducer';

const rootReducer = combineReducers({
    UserLogin: userLoginReducer,
    UserRegister: userRegisterReducer,
    UserData: userDataReducer,

    SocketReducer:SocketReducer,

    StartGame:startGameReducer,
    CreateRoom : createRoomReducer,
    JoinRoom : joinRoomReducer,
    RoomDetails: RoomDetailsReducer,

    PlayCard:playCardReducer


});

export default rootReducer;