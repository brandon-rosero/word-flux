import React, { useStatem, useEffect, useState, useContext } from 'react'
import { GlobalContext } from '../context';

const HighlightText = ({transcript, currentWordIndex, language, url}) => {
    const { textInput, setCurrentLexicalWords, setCurrentWord, setDefinitions } = useContext(GlobalContext)
    const [message, setMessage] = useState();

    return (
         <div className='text'>
          {transcript?.map((word, index) => (
            <span key={index}
              className={
                index === currentWordIndex ? 'word' : ''
              }
              onClick={() => {getWordDefinition(removePunctuation(word.word.toLowerCase()), language); 
                wordCLickInteraction(removePunctuation(word.word.toLowerCase()), url)}}
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

      function wordCLickInteraction(word, url){
        // console.log(url)
        // let video_url = "";
        // if(url !== "" || url !== undefined){
        //   video_url = url;
        // }
        // else{
        //   video_url = textInput;
        // }
        //  console.log(video_url)
        fetch("http://127.0.0.1:5000/api/add_word_click_interaction", {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            
          },
          credentials: 'include',
          body: JSON.stringify({word: word, video_url: url, interaction: "click"})
        }).then((res => res.json())).then(data => {setMessage(data['message'])})
      }
    
      function removePunctuation(str){
        return str.replace(/[,.!?]/g, "", '')
      }  
}

export default React.memo(HighlightText);
