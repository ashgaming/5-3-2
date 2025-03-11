import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import GamePage from './pages/GamePage';
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {

  return (
    <main className='overflow-hidden'>
      <Router>
        <Routes>
          <Route path="/game" element={<GamePage />} />
          <Route path="/login" element={ <LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path='/' element={<Home />} />
          {/* <Route path='*' element={<NotFound />} /> */}
          <Route path='/menu' element={<MenuPage />} />
        </Routes>
      </Router>
    
    </main>
  )
}

export default App
