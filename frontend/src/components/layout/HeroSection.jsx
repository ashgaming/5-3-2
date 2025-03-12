import React from 'react'
import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <div className='hero-container flex flex-col justify-center  items-center text-white'>
        <div className="game-menu-panel w-96 p-8 bg-gray-800/90 rounded-xl shadow-2xl border border-gray-700 transform hover:scale-105 transition-all duration-300">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Game Menu
        </h1>

        <div className="flex flex-col gap-4">
          {/* Play Button */}
          <Link
            to="/menu"
            className="block w-full py-3 px-6 text-center bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-colors duration-200 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Play
          </Link>

          {/* Settings Button */}
          <Link
            to="/settings"
            className="block w-full py-3 px-6 text-center bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-lg transition-colors duration-200 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Settings
          </Link>

          {/* Options Button */}
          <Link
            to="/options"
            className="block w-full py-3 px-6 text-center bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-lg transition-colors duration-200 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Options
          </Link>

          {/* More Button */}
          <Link
            to="/login"
            className="block w-full py-3 px-6 text-center bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold text-lg transition-colors duration-200 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Login
          </Link>

          {/* Exit Button */}
          <Link
            to="/exit"
            className="block w-full py-3 px-6 text-center bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-lg transition-colors duration-200 transform hover:-translate-y-1 hover:shadow-lg"
          >
            Exit
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
