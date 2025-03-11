import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setOrder } from '../../redux/actions/game.action';

const SelectOrderPop = ({ setIsSetOrderPopOpen }) => {
    const { gameId, game } = useSelector(state => state.RoomDetails)
    const { user } = useSelector(state => state.UserData)


    const dispatch = useDispatch()
    const HandleSettingOrder = (e, value) => {
        e.preventDefault();
        e.stopPropagation();
        if(value){
            dispatch(setOrder({
                gameId,
                order: value
            }))
        }

        console.log('hit here')
    }

    console.log('game in Select Order POp' , game)
    return (
        <div className='fixed h-screen w-screen z-50 bg-black/50'>
            {
                String(user.user?._id) !== String(game?.game?.master) ?
                    <div className='flex h-full justify-center items-center'>
                    <div> Waiting For Order From  {game?.game?.master}  </div>
                    </div>
                    :
                    <div className='flex justify-center items-center h-full w-full'>

                        <div className='h-1/3 w-[90%] bg-amber-100 rounded-4xl flex justify-between p-2 '>
                            <button onClick={(e) => HandleSettingOrder(e, 'spade')}>
                                <img className='w-50 aspect-square' src='https://tse1.mm.bing.net/th?id=OIP.XDFGwnnXOqskOCECXguVowHaG4&pid=Api&P=0&h=180' alt='' />
                            </button>

                            <button onClick={(e) => HandleSettingOrder(e, 'heart')}>
                                <img className='w-50 aspect-square' src='https://tse3.mm.bing.net/th?id=OIP.n6TuCniyLoIUA52adXmMYgHaHa&pid=Api&P=0&h=180' alt='' />
                            </button>

                            <button onClick={(e) => HandleSettingOrder(e, 'clover')}>
                                <img className='w-50 aspect-square' src='https://tse3.mm.bing.net/th?id=OIP.HXPHW2JDPqKpHSLkI7doKQHaHa&pid=Api&P=0&h=180' alt='' />
                            </button>

                            <button onClick={(e) => HandleSettingOrder(e, 'diamond')}>
                                <img className='w-50 aspect-square' src='https://static.vecteezy.com/system/resources/previews/025/456/793/original/diamond-playing-card-red-symbol-icon-isolated-illustration-free-vector.jpg' alt='' />
                            </button>
                        </div>
                    </div>

            }
        </div>
    )


}

export default SelectOrderPop
