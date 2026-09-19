import React, { useEffect, useState, useContext } from 'react'
import { GlobalContext } from '../context';
import "../css/videoLibrary.css"
import { Link } from "react-router-dom";
import { Bold, Trash } from 'lucide-react';


const SavedVideoCard = ({videos}) => {
    const {setTextInput} = useContext(GlobalContext)

    function deleteSavedVideo(video_id){
        fetch(`http://127.0.0.1:5000/api/delete_saved_videos/${video_id}`, { 
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',  
            },
            credentials: 'include',
        }).then(res => res.json()).then(data => {console.log(data)})
    }
  
    return (
    <>
        {videos?.map((video, index) => (
            <div className='video-card' key={index}>
                <Link to="/media" state={{video_url: video.video_url, transcript: video.transcript, videoLanguage: video.language}}>
                    <div className='video-info'>
                        <img src={video.thumbnail_url} className='video-image'/>
                        <div className='video-info-text'>
                            <div className='video-language'>({video.language})</div>     
                            <div className='video-title'>{video.title}</div>       
                        </div>     
                    </div>
                </Link>
                <div className='video-delete'>   
                    <Trash style={{cursor: 'pointer'}} onClick={() => deleteSavedVideo(video.id)}/>
                </div>  
            </div>
        ))}
    </>
  )
}

export default SavedVideoCard