import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { receiveMessage, setUpSocket, socket } from '../redux/actions/socket.action'
import { createRoom, joinRoom, leaveRoom, modifyplayerList, startGame } from '../redux/actions/game.action'
import { SET_GAME_ID } from '../redux/constants/game.constants'
import ButtonLoader from '../components/Elements/ButtonLoader'

const MenuPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { roomId, players } = useSelector(state => state.RoomDetails)
  const { success: StartGameSuccess } = useSelector(state => state.StartGame)
  const { loading:createRoomLoading } = useSelector(state => state.CreateRoom)
  const { loading:JoinRoomLoading } = useSelector(state => state.JoinRoom)
  const roomIdRef = useRef(null)
  // const { receiveMessage } = useSelector(state => state.SocketReducer)
  const [loadedForm, setLoadedForm] = useState('join')
  const [roomLoading , setRoomLoading] = useState(false);

  const StartGameHandler = () => {
    dispatch(startGame({
      roomId
    }))


    receiveMessage('game-started', (data) => {
      console.log('SET_GAME_ID', data)

      dispatch({
        type: SET_GAME_ID,
        payload: data
      })

      navigate('/game')
    });
  }

  const handleLeaveRoom = () => {
    dispatch(leaveRoom({
      roomId
    }))
  }

  const HandleJoinRoom = () => {
    dispatch(joinRoom({
      roomId: roomIdRef.current.value
    }))
    
    roomIdRef.current.value = '';
  };


  const HandleCreateNewRoom = () => {
    dispatch(createRoom())
  }

  useEffect(() => {
    // Assuming receiveMessage is your socket.io listener function
    receiveMessage('new-player-join-room', (data) => {
      console.log('data', data)
      dispatch(modifyplayerList(data))
    });

    // Cleanup function to remove the listener when component unmounts
    return () => {
      // If receiveMessage returns an off/unsubscribe function, call it here
      socket.off('new-player-join-room');
    };
  }, []);


  // useEffect(()=>{
  //     if(players?.length === 3){
  //       setTimeout(()=>{
  //           StartGameHandler()
  //           console.log('game started')
  //       },5000)
  //     }
  // },[players])

  return (
    <div className="relative h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black overflow-hidden">
  {/* Animated Background Image */}
  {/* <img
    src="bg.webp"
    alt="Background"
    className="fixed top-0 left-0 w-screen h-screen object-cover -z-10 opacity-60 animate-pulse-slow"
  /> */}

  {/* Floating Particles Effect (Pseudo-element or additional divs) */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="w-2 h-2 bg-blue-400 rounded-full absolute animate-float" style={{ top: '20%', left: '10%' }}></div>
    <div className="w-3 h-3 bg-purple-400 rounded-full absolute animate-float-delayed" style={{ top: '50%', left: '80%' }}></div>
    <div className="w-1 h-1 bg-pink-400 rounded-full absolute animate-float" style={{ top: '70%', left: '30%' }}></div>
  </div>

  <Navbar /> {/* Assuming Navbar is a separate component */}

  <div className="hero-container flex flex-col justify-center items-center text-white h-[80%] px-4">
    {!roomId ? (
      <div className="w-full max-w-md animate-fade-in">
        {/* Menu Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setLoadedForm("join")}
            className="py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-lg text-lg font-bold shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            Join
          </button>
          <button
            onClick={() => setLoadedForm("create")}
            className="py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-lg text-lg font-bold shadow-lg transform hover:-translate-y-1 transition-all duration-300"
          >
            Create
          </button>
        </div>

        {/* Form Panel */}
        <div className="w-full p-6 bg-gray-800/90 rounded-xl shadow-2xl border border-gray-700 transform transition-all duration-500 animate-slide-up">
          {loadedForm === "join" ? (
            <div className="flex flex-col items-center gap-4">
              <input
                type="text"
                ref={roomIdRef}
                className="w-full p-3 bg-gray-900/80 text-white rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                placeholder="Enter Room ID"
              />
              <button
                onClick={(e) => HandleJoinRoom(e)}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded-lg font-semibold text-lg shadow-md transform hover:scale-105 transition-all duration-300"
              >
                { JoinRoomLoading ? <ButtonLoader /> :  'Join Room' }
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => HandleCreateNewRoom(e)}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded-lg font-semibold text-lg shadow-md transform hover:scale-105 transition-all duration-300"
            >
               { createRoomLoading ? <ButtonLoader /> :  'Create Room' }
              
            </button>
          )}
        </div>
      </div>
    ) : (
      <div className="w-full max-w-md p-6 bg-gray-800/90 rounded-xl shadow-2xl border border-gray-700 animate-slide-up">
        <h1 className="text-2xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Room ID: {roomId}
        </h1>

        {players.length !== 3 ? (
          <h2 className="text-lg text-center text-yellow-400 animate-pulse">
            Waiting for Players...
          </h2>
        ) : (
          <h2 className="text-lg text-center text-green-400">Ready!</h2>
        )}

        {/* Player List */}
        <div className="my-4">
          {players.map((player) => (
            <p
              key={player?.userId}
              className="text-center py-1 text-white animate-fade-in-up"
            >
              {player?.userId}
            </p>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={() => handleLeaveRoom()}
            className="py-2 px-6 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-xl font-semibold shadow-md transform hover:scale-105 transition-all duration-300"
          >
            Leave
          </button>
          <button
            onClick={() => StartGameHandler()}
            className={`py-2 px-6 ${
              StartGameSuccess
                ? "bg-gradient-to-r from-blue-500 to-blue-700"
                : "bg-gradient-to-r from-green-500 to-green-700"
            } hover:from-${StartGameSuccess ? "blue" : "green"}-600 hover:to-${
              StartGameSuccess ? "blue" : "green"
            }-800 rounded-xl font-semibold shadow-md transform hover:scale-105 transition-all duration-300`}
          >
            {StartGameSuccess ? "Started" : "Start"}
          </button>
        </div>
      </div>
    )}
  </div>
</div>

  )
}

export default MenuPage
