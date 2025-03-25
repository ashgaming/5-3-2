import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { continueToPlay } from "../../redux/actions/game.action";

const WantToContinuePlay = ( {gameResult, onContinue, setShowPopup} ) => {
    const [readyPlayers, setReadyPlayers] = useState({});
    const dispatch = useDispatch()

    const { panelData , gameId='67d1a7e6047d2411c17d660d' } = useSelector(state=>state.RoomDetails)

    // Mock data if gameResult is not provided (replace with actual props)
    const defaultResult = {
        players: panelData,
        outcomes: [
            { winner: "Player 2", loser: "Player 1", points: 1 },
            { winner: "Player 2", loser: "Player 3", points: 1 },
        ],
    };

    const result = gameResult || defaultResult;

    // Toggle ready status for a player
    const toggleReady = (playerId) => {

        dispatch(continueToPlay(
            {
                gameId
            }
        ))
        
        setReadyPlayers((prev) => ({
            ...prev,
            [playerId]: !prev[playerId],
        }));
    };

    console.log('panelData',panelData)

    // Check if all players are ready
    const allReady = result.players.every((player) => readyPlayers[player.id]);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-gray-900/95 w-full max-w-lg p-6 rounded-xl shadow-2xl border border-gray-700 transform transition-all duration-300 animate-slide-up">
                {/* Header */}
                <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                    Game Results
                </h2>

                {/* Player Stats */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-blue-300 mb-2">Player Stats</h3>
                    <div className="grid gap-4">
                        {result.players.map((player) => (
                            <div
                                key={player.id}
                                className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg"
                            >
                                <div>
                                    <p className="text-white font-medium">{player.name}</p>
                                    <p className="text-sm text-gray-300">
                                        Target: {player.target} | Score: {player.score}
                                    </p>
                                </div>
                                <button
                                    onClick={() => toggleReady(player.id)}
                                    className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${readyPlayers[player.id]
                                            ? "bg-green-500 hover:bg-green-600"
                                            : "bg-gray-600 hover:bg-gray-500"
                                        }`}
                                >
                                    {readyPlayers[player.id] ? "Ready" : "Not Ready"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Outcomes */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-blue-300 mb-2">Outcomes</h3>
                    {result.outcomes.length > 0 ? (
                        <ul className="space-y-2">
                            {result.outcomes.map((outcome, index) => (
                                <li key={index} className="text-gray-200">
                                    <span className="text-green-400 font-medium">{outcome.winner}</span> lose {" "}
                                    <span className="text-red-400 font-medium">{outcome.points}</span> points to {" "}
                                    <span className="text-red-400 font-medium">{outcome.loser}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400">No decisive outcomes this round.</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onContinue}
                        className={`px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded-lg font-semibold shadow-md transform transition-all duration-300 ${!allReady ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                            }`}
                        disabled={!allReady}
                    >
                        Continue
                    </button>
                    <button
                        onClick={()=>setShowPopup(false)}
                        className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-lg font-semibold shadow-md transform hover:scale-105 transition-all duration-300"
                    >
                        Exit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WantToContinuePlay;
