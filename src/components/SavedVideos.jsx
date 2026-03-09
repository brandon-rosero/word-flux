import React, { useEffect, useState } from 'react'
import "../css/videoLibrary.css"
import { Navbar } from './Navbar'
import SavedVideoCard from './SavedVideoCard'

const SavedVideos = () => {
    
    const [userVideos, setUserVideos] = useState()

    useEffect(() => {    
        fetch("http://127.0.0.1:5000/api/get_saved_videos", { 
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',  
            },
            credentials: 'include',
        }).then(res => res.json()).then(data => {setUserVideos(data); console.log(data)})
      }, [])
  
    return (
    <>
        <Navbar />
        <div className='video-library-container'>
            <SavedVideoCard videos={userVideos}/>
        </div>
    </>
  )
}

export default SavedVideos