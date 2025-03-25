import React, { useEffect, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import HeroSection from '../components/layout/HeroSection'
import { useDispatch, useSelector } from 'react-redux'
import { receiveMessage, setUpSocket } from '../redux/actions/socket.action'
import { Socket } from 'socket.io-client'
import WantToContinuePlay from '../components/GamePops/WantToContinuePlay'
import { AppDispatch } from '../redux/actions/game.action'
import { SET_CONTINUE_PLANEL_DATA } from '../redux/constants/game.constants'

const Home = () => {
  const dispatch = useDispatch();


  const { user } = useSelector(state => state.UserData)
  const { sendMessage, socket } = useSelector(state => state.SocketReducer)
  const { gameId = '67d1a7e6047d2411c17d660d' } = useSelector(state => state.RoomDetails)


  useEffect(() => {
    if (!user.user?._id) { return }

    if (!socket) { dispatch(setUpSocket({userId:user.user?._id})); }

    // if (!sendMessage) { return }
    // sendMessage(
    //   'join', {
    //   userId: user.user?._id
    // }
    // )

    receiveMessage(`new-round-set-${gameId}`, (data) => {
      AppDispatch({
        type: SET_CONTINUE_PLANEL_DATA,
        payload: data
      })
    });

  }, [user.user?._id])

  const [showPopup, setShowPopup] = useState(false);

  const gameResult = {
    players: [
      { id: 1, name: "Alice", target: 5, score: 85, ready: false },
      { id: 2, name: "Bob", target: 3, score: 110, ready: false },
      { id: 3, name: "Charlie", target: 2, score: 95, ready: false },
    ],
    outcomes: [
      { winner: "Bob", loser: "Alice", points: 1 },
      { winner: "Bob", loser: "Charlie", points: 1 },
    ],
  };

  return (
    <div>
      <img src='bg.webp'
        alt=''
        className='fixed top-0 left-0 w-screen h-screen -z-10 object-cover'
      />

      <Navbar />

      <HeroSection />

      {
        showPopup && (
          <WantToContinuePlay
            setShowPopup={setShowPopup}
            gameResult={gameResult}
            onContinue={() => {
              console.log("Continuing to next round...");
              setShowPopup(false);
            }}
          />
        )
      }

    </div>
  )
}

export default Home
