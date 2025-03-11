import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { receiveMessage, setUpSocket, socket } from '../redux/actions/socket.action'
import { createRoom, joinRoom, leaveRoom, modifyplayerList, startGame } from '../redux/actions/game.action'
import { SET_GAME_ID } from '../redux/constants/game.constants'

const MenuPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { roomId, players } = useSelector(state => state.RoomDetails)
  const { success: StartGameSuccess } = useSelector(state => state.StartGame)
  const roomIdRef = useRef(null)
  // const { receiveMessage } = useSelector(state => state.SocketReducer)
  const [loadedForm, setLoadedForm] = useState('join')

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
    <div>
      <img src='bg.webp'
        alt=''
        className='fixed top-0 left-0 w-screen h-screen -z-10 object-cover'
      />

      <Navbar />

      <div className='hero-container flex flex-col justify-center  items-center text-white'>

        {
          !roomId &&
          <>
            <div className='grid grid-cols-2 gap-1 w-full '>
              <button onClick={() => setLoadedForm('join')}>Join</button>
              <button onClick={() => setLoadedForm('create')}>Create</button>
            </div>


            <div className='w-full h-100  m-5 bg-amber-300 flex items-center justify-center'>
              {
                loadedForm === 'join' ?
                  <>
                    <div>

                      <input type='text' ref={roomIdRef} className='w-full p-3 bg-black/10 my-5' />
                      <button onClick={(e) => HandleJoinRoom(e)} className='bg-green-400 p-2 rounded-xl'> Join Room</button>
                    </div>
                  </>
                  :
                  <>
                    <button onClick={(e) => HandleCreateNewRoom(e)} className='bg-green-400 p-2 rounded-xl '>Create Room</button>
                  </>
              }
            </div>
          </>
        }

        {
          roomId &&

          <div className='w-full h-100  m-5 bg-amber-300 flex items-center justify-center'>
            <div>


              <h1> RoomID : {roomId} </h1>

              {players.length !== 3 && <h1> Waiting for Player </h1>}

              {
                players.map((player) => (
                  <p key={player?.userId}> {player?.userId}</p>
                ))
              }

              <div className='w-full flex gap-5 mt-5'>
                <button onClick={() => handleLeaveRoom()} className='bg-red-600 rounded-2xl p-1 px-5'>Leave</button>
                <button onClick={() => StartGameHandler()} className={`${StartGameSuccess ? 'bg-blue-600' : 'bg-green-600'} rounded-2xl p-1 px-5 `}>
                  {StartGameSuccess ? 'Started' : 'Start'}
                </button>
              </div>
            </div>
          </div>
        }




      </div>
    </div>
  )
}

export default MenuPage
