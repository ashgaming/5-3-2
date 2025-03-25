import { combineReducers } from 'redux';
import { userDataReducer, userLoginReducer, userRegisterReducer } from './reducers/user.reducer';
import { SocketReducer } from './reducers/socket.reducer';
import { createRoomReducer, joinRoomReducer, playCardReducer, ReadyToContinueReducer, RoomDetailsReducer, startGameReducer  } from './reducers/game.reducer';
import { PeerReducer } from './reducers/peer.reducer';

const rootReducer = combineReducers({
    UserLogin: userLoginReducer,
    UserRegister: userRegisterReducer,
    UserData: userDataReducer,

    SocketReducer:SocketReducer,
    PeerReducer:PeerReducer,

    StartGame:startGameReducer,
    CreateRoom : createRoomReducer,
    JoinRoom : joinRoomReducer,
    RoomDetails: RoomDetailsReducer,

    PlayCard:playCardReducer,
    ReadyToContinue:ReadyToContinueReducer,


});

export default rootReducer;