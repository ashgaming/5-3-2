import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import GamePage from './pages/GamePage';
import MenuPage from './pages/MenuPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Wrapper from './components/Elements/Wrapper';

function App() {

  return (
    <main className='overflow-hidden'>
      <Router>
        <Routes>
          <Route path="/game" element={
            <Wrapper>
              <GamePage />
            </Wrapper>
          } />
          <Route path="/login" element={<Wrapper> <LoginPage /> </Wrapper>} />
          <Route path="/register" element={<Wrapper> <RegisterPage /></Wrapper>} />
          <Route path='/' element={<Home />} />
          <Route path='/menu' element={<Wrapper> <MenuPage /></Wrapper>} />
          {/* <Route path='*' element={<NotFound />} /> */}
        </Routes>
      </Router>

    </main>
  )
}

export default App
