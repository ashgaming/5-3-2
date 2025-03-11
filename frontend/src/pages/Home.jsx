import React, { useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import HeroSection from '../components/layout/HeroSection'
import { useDispatch, useSelector } from 'react-redux'
import { setUpSocket } from '../redux/actions/socket.action'
import { Socket } from 'socket.io-client'

const Home = () => {
  const dispatch = useDispatch();
  dispatch(setUpSocket());

  const { user } = useSelector(state => state.UserData)
  const { sendMessage } = useSelector(state => state.SocketReducer)


useEffect(()=>{
  if(user.user?._id){
    console.log(user.user?._id)
    sendMessage(
      'join', {
        userId: user.user?._id
      }
    )
  }
},[])



  return (
    <div>
      <img src='bg.webp'
        alt=''
        className='fixed top-0 left-0 w-screen h-screen -z-10 object-cover'
      />

      <Navbar />

      <HeroSection />


    </div>
  )
}

export default Home
