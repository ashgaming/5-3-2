import React from 'react'
import { useSelector } from 'react-redux'

const WinnerAnoucement = ({ winner }) => {
    const { user } = useSelector(state => state.UserData)
    console.log('winnner in Anocemnent , ' , winner)
    if(String(winner?.winnerPlayer) === String(user?.user?._id)){
        console.log('i win the play')
    }
    return (
        <div className='fixed h-screen w-screen z-50 bg-black/50'>
            <div className='flex h-full justify-center items-center' >
                <div>
                    {
                        String(winner?.winnerPlayer) === String(user?.user?._id) ?
                        <h1> You won this round </h1> :
                        <h1> Winner is {winner?.winnerPlayer} </h1> 
                    }
                </div>
            </div>
        </div >
    )
}

export default WinnerAnoucement
