import React, { useEffect, useState } from 'react'
import "../css/videoLibrary.css"
import { Navbar } from './Navbar'
import SavedVideoCard from './SavedVideoCard'
import LibrarySidebar from './LibrarySidebar'
import FlashcardLibrary from './FlashcardLibrary'
import API_URL from "../api.js";

const SavedVideos = () => {
    const [userVideos, setUserVideos] = useState()
    const [userFlashcardSets, setUserFlashcardSets] = useState()
    const [activeTab, setActiveTab] = useState('videos');

    useEffect(() => {    
        fetch(`${API_URL}/api/get_saved_videos`, { 
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',  
            },
            credentials: 'include',
        }).then(res => res.json()).then(data => {setUserVideos(data); console.log(data)})

        fetch(`${API_URL}/api/get_flashcard_sets`, { 
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',  
            },
            credentials: 'include',
        }).then(res => res.json()).then(data => {setUserFlashcardSets(data); console.log(data)})
      }, [])

    return (
    <>
        <Navbar />
        <div className='video-library-container'>
            <LibrarySidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab == 'videos' ? <div className='library-container'><SavedVideoCard videos={userVideos}/></div> : 
            <div className='library-container'><FlashcardLibrary sets={userFlashcardSets}/></div>}
        </div>   
    </>
  )
}

export default SavedVideos