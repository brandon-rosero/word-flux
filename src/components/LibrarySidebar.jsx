import React, { useEffect, useState, useContext } from 'react'
import { GlobalContext } from '../context';
import "../css/videoLibrary.css"
import { NotebookText, Video, FolderClosed } from 'lucide-react';

const LibrarySidebar = ({activeTab, setActiveTab}) => {

  return (
    <div className='options-tab'>    
        <ul className="sidebar-menu">
          <li className={`menu-item ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}><Video /><span>Videos</span></li>
          <li className={`menu-item ${activeTab === 'flashcards' ? 'active' : ''}`} onClick={() => setActiveTab('flashcards')}><FolderClosed /><span>Flashcards</span></li>
        </ul>
      
    </div>
  )
}

export default LibrarySidebar