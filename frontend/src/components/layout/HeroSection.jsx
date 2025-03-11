import React from 'react'
import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <div className='hero-container flex flex-col justify-center  items-center text-white'>
        <Link to='menu' > Menu </Link>
    </div>
  )
}

export default HeroSection
