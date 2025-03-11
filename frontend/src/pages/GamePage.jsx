import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getGameData } from '../redux/actions/game.action';
import SelectOrderPop from '../components/GamePops/SelectOrderPop';
import { SET_GAME_ORDER, SET_PLAY_TURN } from '../redux/constants/game.constants';
import { receiveMessage, sendMessage, socket } from '../redux/actions/socket.action';
import ConfirmPlayMyCardPop from '../components/GamePops/ConfirmPlayMyCardPop';
import WaitingForWinner from '../components/GamePops/WaitingForWinner';
import WinnerAnoucement from '../components/GamePops/WinnerAnoucement';

const GamePage = () => {

  const OrderData = {
    'unset': 'https://tse3.mm.bing.net/th?id=OIP.rBAVC7eUOf1E-DPFq_DMMAAAAA&pid=Api&P=0&h=180',
    'spade': 'https://tse1.mm.bing.net/th?id=OIP.XDFGwnnXOqskOCECXguVowHaG4&pid=Api&P=0&h=180',
    'heart': 'https://tse3.mm.bing.net/th?id=OIP.n6TuCniyLoIUA52adXmMYgHaHa&pid=Api&P=0&h=180',
    'clover': 'https://tse3.mm.bing.net/th?id=OIP.HXPHW2JDPqKpHSLkI7doKQHaHa&pid=Api&P=0&h=180',
    'diamond': 'https://static.vecteezy.com/system/resources/previews/025/456/793/original/diamond-playing-card-red-symbol-icon-isolated-illustration-free-vector.jpg',
  }

  const dispatch = useDispatch()
  const [playerCards, setPlayerCards] = useState([]);
  const [cardsInPlay, setCardsInPlay] = useState([]);
  const [setOrderPopOpen, setIsSetOrderPopOpen] = useState(false);
  const [isWaitingForWinner, setIsWaitingForWinner] = useState(false);
  const [isWinnerAnoucementOpen, setIsWinnerAnoucementOpen] = useState()

  const [selectedCard, setSelectedCard] = useState(null)

  const { game, roomId, gameId, order, playTurn } = useSelector(state => state.RoomDetails)
  const { user } = useSelector(state => state.UserData)
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  useEffect(() => {
    console.log('initial gameId', gameId)
    if (gameId) { dispatch(getGameData(gameId)) }
  }, [gameId])

  useEffect(() => {

    if (game?.game?.players) {

      game.game.players?.map((player) => {
        if (player?.cards[0]?._id) {
          setPlayerCards(
            player.cards
          )
        }
      })
    }
    else {
      console.log('game?.players not found')
    }
  }, [game])


  useEffect(() => {
    if (!order || order === 'unset') {
      setIsSetOrderPopOpen(true)
    }
  }, [gameId])


  const playMyCard = (card) => {
    console.log('playTurn', playTurn)
    console.log('userId', user?.user?._id)
    if (String(playTurn) === String(user?.user?._id)) {
      setSelectedCard(card?.id)
      // remove card for array state by id == card
    }

  }

  useEffect(() => {
    receiveMessage('order-set', (data) => {

      dispatch({
        type: SET_GAME_ORDER,
        payload: data
      })

      setIsSetOrderPopOpen(false)

      socket.off('order-set');
    });


    receiveMessage('getIsMyTern', (data) => {
      dispatch({
        type: SET_PLAY_TURN,
        payload: data.master || data
      })
    });


    receiveMessage('cardsInPlay', (data) => {

      setCardsInPlay(prevCards => {
        const newCard = data?._card;
        // Check if newCard already exists in prevCards (using id or other unique property)
        const exists = newCard && prevCards.some(card => card.id === newCard.id);

        if (exists) {
          return prevCards; // Don't add if it already exists
        }


        return prevCards.length < 3
          ? [...prevCards, newCard] // Add if less than 3
          : [newCard]; // Reset to just the new card if at 3
      });

      return () => {
        socket.off('order-set')
        socket.off('setCardInPlay')
      }
    });

  }, []);

  useEffect(() => {
    if (cardsInPlay.length > 2) {
      setIsWaitingForWinner(true)
      sendMessage('FindTheWinnerOfPlay', { gameId: gameId })

      setTimeout(() => {
        receiveMessage('WinnerOfPlay', (data) => {
          console.log('winner',data)
          setIsWaitingForWinner(false)

          setIsWinnerAnoucementOpen(data)

          setTimeout(() => {
            setIsWinnerAnoucementOpen(null)
          }, 2000)

          setCardsInPlay([]);

          return () => {
            socket.off('WinnerOfPlay')
          }
        });
      }, 100)
    }
  }, [cardsInPlay.length])

  console.log('cardsInPlay', cardsInPlay.length)
  console.log('cardsInPlay state here : ', cardsInPlay)

  return (
    <main className='flex flex-col items-center justify-center h-screen w-screen text-center text-white overflow-hidden'>
      <img src='https://tse3.mm.bing.net/th?id=OIP.Yrsva_FLP7aNKFQQv8V3egHaFQ&pid=Api&P=0&h=180' className='fixed top-0 left-0 w-screen h-screen -z-10' />
      {setOrderPopOpen && <SelectOrderPop setIsSetOrderPopOpen={setIsSetOrderPopOpen} />}
      {selectedCard && <ConfirmPlayMyCardPop setPlayerCards={setPlayerCards} selectedCard={selectedCard} setSelectedCard={setSelectedCard} />}
      {isWaitingForWinner && <WaitingForWinner />}
      {isWinnerAnoucementOpen && <WinnerAnoucement winner={isWinnerAnoucementOpen} />}
      <div className='fixed top-0 left-0 w-screen h-7 bg-black/20 bg-opacity-50 p-4 z-10 flex justify-between items-center text-blue-500'>
        <h1 className='text-4xl font-bold'>Card Game</h1>
        <p>table no : {game?.game?._id}</p>
        <p> Round : 3 </p>
      </div>

      <div
        id='side'
        className="fixed top-0 left-0 w-0.1 h-screen bg-black/20 bg-opacity-50 p-4 z-20"
      //  onMouseEnter={() => setIsSideBarOpen(true)}
      //  onMouseLeave={() => setIsSideBarOpen(false)}
      >
      </div>

      <div id='sidebar' className={`fixed flex-col max-w-1/4 gap-5  justify-between top-0 left-0 w-1/4 h-screen bg-black/20 bg-opacity-50 p-4 z-20 ${!isSideBarOpen && 'hidden'}`}>
        <div className='w-full flex max-h-10 gap-2'>
          <button className='bg-blue-500 p-2 rounded-lg w-full'>Test</button>
          <Link to={'/'} className='bg-blue-500 p-2 rounded-lg w-full'>Exit</Link>
          <button onClick={() => setPlayerCards([])} className='bg-red-500 p-2 rounded-lg w-full '>Clear Cards</button>
          <button onClick={() => setIsSideBarOpen(false)} className='bg-blue-500 p-2 rounded-lg w-full'>x</button>
        </div>
        {/* <div className='w-full h-[90%] bg-amber-500 flex-1 gap-2 mt-2'>
          <div> <h1> Round 1 </h1> </div>
          <div>
            {
              Array.map((item,index) => (
                <div key={index}>
                  {
                    item.map((card) => (
                      <div>
                        
                      </div>
                    ))
                  }
                </div>
              ))
            }
          </div>
        </div> */}
      </div>


      <div className='fixed bg-black/10 w-[90%] flex justify-between top-7 h-30 p-4 rounded-lg '>
        <div>
          <p> player 1 </p>
          <img src="cards.png" alt="" />
        </div>

        <div>
          {
            order && <img className='w-20 aspect-square rounded-full ' src={OrderData[order]} alt="" />
          }

        </div>

        <div>
          <p> player 2 </p>
          <img src="cards.png" alt="" />
        </div>

      </div>

      <div className='fixed gap-4 bg-black/10 w-[90%] flex justify-between center-0 h-60 p-4 rounded-lg '>
        {cardsInPlay
          .map(card => (
            <img
              key={card.id}
              src={card.image}
              alt={card.number}
              className="w-20 h-50 bg-blue-200"
            />
          ))}
      </div>


      <div className={`fixed grid grid-cols-10 gap-4  w-[90%] bottom-20 h-30 p-4 rounded-lg  ${playTurn !== user?.user?._id ? 'bg-black/10' : 'bg-blue-800'} `}>
        {playerCards.map(card => (
          <img key={card.id} src={card.image} alt={card.number} className={`w-20 h-30 ${selectedCard === card?.id && 'scale-150 border border-cyan-500'} `} onClick={() => {
            playMyCard(card);
          }} />
        ))}
      </div>

    </main>
  )
}

export default GamePage
