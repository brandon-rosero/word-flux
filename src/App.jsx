import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Media from './components/Media'
import './App.css'
import Search from './components/Search'
import { Navbar } from './components/Navbar'
import { SavedVideos } from './pages/SavedVideos'
import {Route, Routes} from "react-router-dom"

function App() {

  return (
    <div className='App'>  
      <Navbar />
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/media" element={<Media />} />
        <Route path="/saved" element={<SavedVideos />} />
      </Routes>
    </div>
  )
}

export default App
