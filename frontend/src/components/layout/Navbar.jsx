import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { logoutUser } from '../../redux/actions/user.action'

const Navbar = () => {
  const { user } = useSelector(state => state.UserData)
  const dispatch = useDispatch()

  const HandleLogOut = () => {
    console.log('logout')
    dispatch(logoutUser())
  }

  return (
    <nav className="navbar flex justify-between navbar-expand-lg navbar-light bg-light m-3 bg-black/50 rounded-full p-4 text-white">
      Game


         {
          user?.user?._id &&
            <h1 >{user?.user?.email}</h1>
            
        }
      {
        user?.user?._id ?
          <button onClick={() => HandleLogOut()}>Logout</button>
          :
          <Link to={'/login'}  > Login </Link>
      }
    </nav>
  )
}

export default Navbar
