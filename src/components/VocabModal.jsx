import React, { useStatem, useEffect, useState, useContext, useRef } from 'react'
import "../css/vocabModal.css"
import { GlobalContext } from '../context';

const VocabModal = ({isOpen, onClose}) => {
    if (!isOpen) return null

    const {definitions, word} = useContext(GlobalContext)
    const textareaRef = useRef(null);
    const [name, setName] = useState("");
    const [message, setMessage] = useState();
    const [userFlashcardSets, setUserFlashcardSets] = useState()

    const [checkedItems, setCheckedItems] = useState([]);
    const [checkedNames, setCheckedNames] = useState([]);

    useEffect(() => {    
        fetch("http://127.0.0.1:5000/api/get_flashcard_sets", { 
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',  
            },
            credentials: 'include',
        }).then(res => res.json()).then(data => {setUserFlashcardSets(data); console.log(data)})
      }, [])

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;

        if(checked){
            setCheckedItems((prev) => [...prev, value]);
        } 
        else{
            setCheckedItems((prev) => prev.filter((item) => item !== value));
        }
    };

    const handleCheckboxNameChange = (e) => {
        const { value, checked } = e.target;

        if(checked){
            setCheckedNames((prev) => [...prev, value]);
        } 
        else{
            setCheckedNames((prev) => prev.filter((item) => item !== value));
        }
    };

    function handleVocabSave(){
        let back = []

        if(textareaRef.current.value == ""){
            back = [...checkedItems]
        }
        else{
            back = [...checkedItems, textareaRef.current.value]
        }

        let flashcardSetName = ""
        if(checkedNames.length > 1 || name.length > 1 && checkedNames.length > 0){
            alert("Please select only one flashcard set!")
        }
        else if(name !== ""){
            flashcardSetName = name
        }
        else{
            flashcardSetName = checkedNames[0]
        }
        console.log(back)
        console.log(flashcardSetName)
        
        fetch("http://127.0.0.1:5000/api/save_flashcard", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({flashcard_set_name: flashcardSetName, flashcard_front: word, flashcard_back: back})
        }).then(res => res.json()).then(data => setMessage(data['message']))

        onClose()
    }
    
    return (
        <div className='m-overlay'>
            <div className='m-container'>
                <div className='front-flashcard'>
                    <div>
                        <button onClick={onClose} className='close-modal-btn'>close</button>
                    </div>
                    <div className='term'>
                        {word}
                    </div>
                </div>
                <div className='back-flashcard'>
                    <div className='checkbox-group'>
                        {definitions.map((option, index) =>(
                            <div className="checkbox-div" key={index}>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        value={option}
                                        checked={checkedItems.includes(option)}
                                        className="small-checkbox"
                                        onChange={handleCheckboxChange}
                                    />  
                                    <span>{option}</span>
                                </label>
                            </div>  
                        ))}
                    </div>
                    <div className='custom-def-div'>
                        <textarea
                            id="custom"
                            ref={textareaRef}
                            placeholder="Custom definition"
                            className='textarea'
                            rows={4}
                            style={{ resize: 'none' }}
                        />
                    </div>
                    <div className='name-selection'>
                        {userFlashcardSets?.map((set, index) =>(
                            <div className="checkbox-div" key={index}>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        value={set.name}
                                        checked={checkedNames.includes(set.name)}
                                        className="small-checkbox"
                                        onChange={handleCheckboxNameChange}
                                    />  
                                    <span>{set.name}</span>
                                </label>
                            </div>  
                        ))}
                    </div>
                        <div>
                            <input 
                                type="text" 
                                placeholder="New flashcard set..." 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    <div>
                        <button className='create-btn' onClick={handleVocabSave}>Create</button>
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default VocabModal