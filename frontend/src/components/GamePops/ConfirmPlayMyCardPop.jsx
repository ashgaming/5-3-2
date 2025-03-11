import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { playMyCards } from '../../redux/actions/game.action';
import { PLAY_MY_CARD_REQUEST } from '../../redux/constants/game.constants';

const ConfirmPlayMyCardPop = ({ selectedCard, setSelectedCard , setPlayerCards }) => {

    const dispatch = useDispatch();
    const { gameId } = useSelector(state => state.RoomDetails)
    const { loading, success } = useSelector(state=>state.PlayCard)


    const playMyCard = (e) => {
        e.preventDefault();
        dispatch(playMyCards({
            gameId: gameId,
            card: String(selectedCard)
        }))

        setPlayerCards(prevCards => prevCards.filter(item => item.id !== selectedCard));

        setSelectedCard(false)
    }

    // if (success) {
    //     setSelectedCard(null)
    //     setTimeout(() => {
    //         dispatch({
    //             type: PLAY_MY_CARD_REQUEST
    //         })
    //     }, 200)
    // }

    return (
        <div className='fixed w-full p-10 bottom-0 h-1/4 z-50'>
            <button onClick={(e) => setSelectedCard(null)}
                className='bg-red-500 text-white p-5 px-10 rounded-4xl hover:bg-red-800 '
            > Cancel </button>

            {
                loading ? (
                    <h1>loading...</h1>
                ) : (
                    <button onClick={(e) => playMyCard(e)}
                        className='bg-green-500 text-white p-5 px-10 rounded-4xl hover:bg-green-800 '
                    > Play </button>
                )
            }


        </div >
    )
}

export default ConfirmPlayMyCardPop
