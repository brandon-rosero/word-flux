import React, { useEffect, useState, useContext } from 'react'
import { MoveLeft, MoveRight } from 'lucide-react';
import "../css/viewFlashcardsModal.css"

const ViewFlashcardsModal = ({ isOpen, onClose, flashcards = [] }) => {
    if (!isOpen || flashcards.length === 0) return null

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };
    
    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const currentCard = flashcards[currentIndex];
    const [showDefinition, setShowDefinition] = useState(false);

  
    return (
    <div className='modal-overlay'>
        <div className="modal-container">
            <button onClick={onClose} className='modal-btn'>close</button>

            <div className="modal-header">
                <span>{currentIndex + 1} / {flashcards.length}</span>
            </div>
            <div>
                {!showDefinition ? 
                <div className="flashcard-card" onClick={() => setShowDefinition(true)}>
                    <h3>{currentCard.front_text}</h3>
                </div> : 
                <div className="flashcard-card" onClick={() => setShowDefinition(false)}>
                    {currentCard.back_text.map((def) => <h3 key={def.id}>- {def}</h3>)}
                </div>}
            </div>
            <div className='modal-footer'>
                <button 
                onClick={() => {handlePrev(); setShowDefinition(false);}} 
                disabled={currentIndex === 0}
                className="modal-btn"
                >
                <MoveLeft />
                </button>

                <button 
                    onClick={() => {handleNext(); setShowDefinition(false);}} 
                    disabled={currentIndex === flashcards.length - 1}
                    className="modal-btn"
                >
                <MoveRight />
                </button>
            </div>
        </div>    
    </div>
  )
}

export default ViewFlashcardsModal