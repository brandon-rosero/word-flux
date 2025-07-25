import React, { useStatem, useEffect, useState } from 'react'
import { useGlobalContext } from '../context';
import "../css/word.css"
const Media = () => {
  
  const [player, setPlayer] = useState();
  const {textInput, setTextInput} = useGlobalContext()
  const [data, setData] = useState([])
  const [time, setTime] = useState(0.0)
  const [language, setLanguage] = useState("")

  useEffect(() => {
    const timerId = setTimeout(() => {
      createIFrame()
      fetch("http://127.0.0.1:5000/api/transcribe", { 
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({ data: textInput })
      }).then(res => res.json()).then(data => {setData(data[0]); setLanguage(data[1])})
    }, 5000);

    return () => {
      clearTimeout(timerId);
    };

  }, [])
  
  useEffect(() =>{ 
    const timerId = setInterval(() => {
      if(player){ 
        setTime(player.getCurrentTime())
      }
    }, 1); 

    return () => {
      clearInterval(timerId);
    };
  }) 
 
  return (
    <>
        <div>
          <div id="player"></div>
          <HighlightText transcript={data} currentTime={time}/>
          <div>THIS IS THE LANGUAGE:{language}</div>
        </div>
    </>
  )

  function getWordDefinition(word, language){
    fetch("http://127.0.0.1:5000/api/get_definitions", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify({word: word, language: language})
    }).then((res => res.json())).then(data => console.log(data))
  }

  function HighlightText({transcript, currentTime}){
    return (
      <div>
        {transcript.map((word, index) => (
          <span key={index}
            className={
              currentTime >= word.start && currentTime <= word.end ? 'word' : ''
            }
            onClick={() => getWordDefinition(word['word'].toLowerCase(), language)}
          >
          {word.word}{' '}
          </span>

        ))}
      </div> 
    )
  }

  function parseURL(url){
    const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regex)
    return (match&&match[7].length==11) ? match[7] : false;
  }

  function createIFrame(){
      const parsedURL = parseURL(textInput)
      // Creates an <iframe> (and YouTube player)
      setPlayer(new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: parsedURL,
          events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange,
          }
      }))     
  }

  function onPlayerReady(event) { 
    event.target.playVideo();
    
  }

  function onPlayerStateChange(event) {
    if(event.data == 0){
        player.destroy();
    }
  }
}

export default Media