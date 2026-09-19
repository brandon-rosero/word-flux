import React, { useContext } from 'react'
import { GlobalContext } from '../context';

const HighlightText = ({transcript, currentWordIndex, language}) => {
    const {setCurrentLexicalWords, setCurrentWord, setDefinitions} = useContext(GlobalContext)
    return (
         <div className='text'>
          {transcript?.map((word, index) => (
            <span key={index}
              className={
                index === currentWordIndex ? 'word' : ''
              }
              onClick={() => getWordDefinition(removePunctuation(word.word.toLowerCase()), language)}
            >
            {word.word}{' '}
            </span>
              
          ))}
        </div>
      )

      function getWordDefinition(word, language){
        fetch("http://127.0.0.1:5000/api/get_definitions", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            
          },
          body: JSON.stringify({word: word, language: language})
        }).then((res => res.json())).then(data => {setCurrentWord(data[0]); setDefinitions(data[1]); setCurrentLexicalWords(data[2])})
      }
    
      function removePunctuation(str){
        return str.replace(/[,.!?]/g, "", '')
      }  
}

export default React.memo(HighlightText);
