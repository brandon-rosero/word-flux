import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Media from './components/Media'
import './App.css'
import Search from './components/Search'
import { Navbar } from './components/Navbar'
import SavedVideos from './components/SavedVideos'
import {Navigate, Route, Routes} from "react-router-dom"
import SignUp from './components/SignUp'
import Login from './components/Login'
import Welcome from './components/Welcome'

function App() {

  return (
    <div className='App'>  
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search" element={<Search />} />
        <Route path="/media" element={<Media />} />
        <Route path="/saved" element={<SavedVideos />} />
        <Route path="/" element={<Welcome />} />
      </Routes>
    </div>
  )
}

export default App
