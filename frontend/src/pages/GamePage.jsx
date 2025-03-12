import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getGameData } from "../redux/actions/game.action";
import SelectOrderPop from "../components/GamePops/SelectOrderPop";
import { SET_GAME_ORDER, SET_PLAY_TURN } from "../redux/constants/game.constants";
import { receiveMessage, sendMessage, socket } from "../redux/actions/socket.action";
import ConfirmPlayMyCardPop from "../components/GamePops/ConfirmPlayMyCardPop";
import WaitingForWinner from "../components/GamePops/WaitingForWinner";
import WinnerAnoucement from "../components/GamePops/WinnerAnoucement";

const GamePage = () => {
  const OrderData = {
    unset: "https://tse3.mm.bing.net/th?id=OIP.rBAVC7eUOf1E-DPFq_DMMAAAAA&pid=Api&P=0&h=180",
    spade: "https://tse1.mm.bing.net/th?id=OIP.XDFGwnnXOqskOCECXguVowHaG4&pid=Api&P=0&h=180",
    heart: "https://tse3.mm.bing.net/th?id=OIP.n6TuCniyLoIUA52adXmMYgHaHa&pid=Api&P=0&h=180",
    clover: "https://tse3.mm.bing.net/th?id=OIP.HXPHW2JDPqKpHSLkI7doKQHaHa&pid=Api&P=0&h=180",
    diamond: "https://static.vecteezy.com/system/resources/previews/025/456/793/original/diamond-playing-card-red-symbol-icon-isolated-illustration-free-vector.jpg",
  };

  const dispatch = useDispatch();
  const [playerCards, setPlayerCards] = useState([]);
  const [cardsInPlay, setCardsInPlay] = useState([]);
  const [setOrderPopOpen, setIsSetOrderPopOpen] = useState(false);
  const [isWaitingForWinner, setIsWaitingForWinner] = useState(false);
  const [isWinnerAnoucementOpen, setIsWinnerAnoucementOpen] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const { game, roomId, gameId, order, playTurn } = useSelector((state) => state.RoomDetails);
  const { user } = useSelector((state) => state.UserData);

  useEffect(() => {
    if (gameId) dispatch(getGameData(gameId));
  }, [gameId]);

  useEffect(() => {
    if (game?.game?.players) {
      game.game.players.forEach((player) => {
        if (player?.cards[0]?._id) setPlayerCards(player.cards);
      });
    }
  }, [game]);

  useEffect(() => {
    if (!order || order === "unset") setIsSetOrderPopOpen(true);
  }, [gameId]);

  const playMyCard = (card) => {
    if (String(playTurn) === String(user?.user?._id)) {
      setSelectedCard(card?.id);
    }
  };

  useEffect(() => {
    receiveMessage("order-set", (data) => {
      dispatch({ type: SET_GAME_ORDER, payload: data });
      setIsSetOrderPopOpen(false);
      socket.off("order-set");
    });

    receiveMessage("getIsMyTern", (data) => {
      dispatch({ type: SET_PLAY_TURN, payload: data.master || data });
    });

    receiveMessage("cardsInPlay", (data) => {
      setCardsInPlay((prevCards) => {
        const newCard = data?._card;
        const exists = newCard && prevCards.some((card) => card.id === newCard.id);
        if (exists) return prevCards;
        return prevCards.length < 3 ? [...prevCards, newCard] : [newCard];
      });
    });

    return () => {
      socket.off("order-set");
      socket.off("setCardInPlay");
    };
  }, []);

  useEffect(() => {
    if (cardsInPlay.length > 2) {
      setIsWaitingForWinner(true);
      sendMessage("FindTheWinnerOfPlay", { gameId: gameId });

      setTimeout(() => {
        receiveMessage("WinnerOfPlay", (data) => {
          setIsWaitingForWinner(false);
          setIsWinnerAnoucementOpen(data);
          setTimeout(() => setIsWinnerAnoucementOpen(null), 2000);
          setCardsInPlay([]);
          socket.off("WinnerOfPlay");
        });
      }, 100);
    }
  }, [cardsInPlay.length]);

  return (
    <main className="relative flex flex-col items-center justify-center h-screen w-screen text-white bg-gradient-to-br from-gray-900 via-indigo-900 to-black overflow-hidden">
      {/* Background Image */}
      <img
        src="https://tse3.mm.bing.net/th?id=OIP.Yrsva_FLP7aNKFQQv8V3egHaFQ&pid=Api&P=0&h=180"
        className="fixed top-0 left-0 w-screen h-screen object-cover -z-10 opacity-70 animate-pulse-slow"
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-2 h-2 bg-blue-400 rounded-full absolute animate-float" style={{ top: "20%", left: "10%" }}></div>
        <div className="w-3 h-3 bg-purple-400 rounded-full absolute animate-float-delayed" style={{ top: "50%", left: "80%" }}></div>
      </div>

      {/* Popups */}
      {setOrderPopOpen && <SelectOrderPop setIsSetOrderPopOpen={setIsSetOrderPopOpen} />}
      {selectedCard && <ConfirmPlayMyCardPop setPlayerCards={setPlayerCards} selectedCard={selectedCard} setSelectedCard={setSelectedCard} />}
      {isWaitingForWinner && <WaitingForWinner />}
      {isWinnerAnoucementOpen && <WinnerAnoucement winner={isWinnerAnoucementOpen} />}

      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-screen bg-gray-800/90 p-4 z-10 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Card Game
        </h1>
        <p className="text-blue-300">Table: {game?.game?._id}</p>
        <p className="text-blue-300">Round: 3</p>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gray-800/90 p-4 z-20 transition-all duration-300 ${
          isSideBarOpen ? "w-1/4" : "w-12"
        }`}
        onMouseEnter={() => setIsSideBarOpen(true)}
        onMouseLeave={() => setIsSideBarOpen(false)}
      >
        <div className={`flex flex-col gap-4 ${!isSideBarOpen && "hidden"}`}>
          <button className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-colors">Test</button>
          <Link to="/" className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-colors text-center">
            Exit
          </Link>
          <button
            onClick={() => setPlayerCards([])}
            className="bg-red-600 p-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear Cards
          </button>
        </div>
        <button
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="absolute top-4 right-2 text-white text-2xl"
        >
          {isSideBarOpen ? "×" : "☰"}
        </button>
      </div>

      {/* Player Info (Top Center) */}
      <div className="fixed top-16 w-[90%] bg-gray-800/80 p-4 rounded-lg flex justify-between items-center animate-fade-in">
        <div className="text-center">
          <p className="text-blue-300">Player 1</p>
          <img src="cards.png" alt="Player 1 Cards" className="w-16 h-24 opacity-70" />
        </div>
        <div>
          {order && (
            <img
              className="w-20 aspect-square rounded-full border-2 border-purple-500 animate-pulse"
              src={OrderData[order]}
              alt={order}
            />
          )}
        </div>
        <div className="text-center">
          <p className="text-blue-300">Player 2</p>
          <img src="cards.png" alt="Player 2 Cards" className="w-16 h-24 opacity-70" />
        </div>
      </div>

      {/* Cards in Play (Middle Center) */}
      <div className="fixed top-1/3 w-[90%] bg-gray-800/80 p-4 rounded-lg flex justify-center gap-6 animate-slide-up">
        {cardsInPlay.map((card) => (
          <img
            key={card.id}
            src={card.image}
            alt={card.number}
            className="w-24 h-36 rounded-lg shadow-lg transform hover:scale-110 transition-transform duration-300"
          />
        ))}
      </div>

      {/* Player Hand (Bottom) */}
      <div
        className={`fixed bottom-8 w-[90%] p-4 rounded-lg grid grid-cols-10 gap-4 transition-colors duration-300 ${
          playTurn !== user?.user?._id ? "bg-gray-800/80" : "bg-blue-900/90 border-2 border-blue-500"
        }`}
      >
        {playerCards.map((card) => (
          <img
            key={card.id}
            src={card.image}
            alt={card.number}
            className={`w-20 h-28 rounded-lg shadow-md cursor-pointer transition-all duration-300 ${
              selectedCard === card?.id ? "scale-125 border-4 border-cyan-500" : "hover:scale-105"
            }`}
            onClick={() => playMyCard(card)}
          />
        ))}
      </div>
    </main>
  );
};

export default GamePage;

