import React, { useEffect, useState, useContext } from 'react'
import { Bold, Trash, NotebookText } from 'lucide-react';
import { Link } from "react-router-dom";
import "../css/videoLibrary.css"
import ViewFlashcardsModal from './ViewFlashcardsModal';

const FlashcardLibrary = ({sets}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const[userFlashcards, setUserFlashcards] = useState()

    function get_flashcards(set_id){
        fetch(`http://127.0.0.1:5000/api/get_flashcards/${set_id}`, { 
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',  
        },
            credentials: 'include',
        }).then(res => res.json()).then(data => {setUserFlashcards(data); console.log(data);})
    }

    function handleSetClick(set_id) {
        get_flashcards(set_id);
        setIsModalOpen(true);
    }

    return (
        <>
            {sets?.map((set, index) => (
                <div className='video-card' key={index}>
                    <Link to={`#${set.name}`}>
                        <div className='video-info' onClick={() => handleSetClick(set.id)}>
                            <div className='video-info-text'>    
                                <NotebookText />
                                <div className='video-title'>{set.name}</div> 
                            </div>     
                        </div>
                    </Link>
                    <div className='video-delete'>   
                        <Trash style={{cursor: 'pointer'}}/>
                    </div> 
                    <ViewFlashcardsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} flashcards={userFlashcards}/>
                </div>
            ))}
            
            
        </>
  )
}

export default FlashcardLibrary