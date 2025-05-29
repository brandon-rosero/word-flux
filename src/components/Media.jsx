import React, { useStatem, useEffect, useState } from 'react'
import { useGlobalContext } from '../context';
const Media = () => {
  
  var player;
  const {textInput, setTextInput} = useGlobalContext()
  const [data, setData] = useState("")
  const [language, setLanguage] = useState("")

  useEffect(() => {

    createIFrame()
    fetch("http://127.0.0.1:5000/api/transcribe", { 
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify({ data: textInput })
    }).then(res => res.json()).then(data => setData(data.text))
    //fetch(`/api/test`).then(res => res.json).then(data => console.log("data"))

  }, [])
 
  return (
    <>
        
        <div>
          <div id="player"></div>
          <div>{data}</div>
        </div>
    </>
  )

  function parseURL(url){
    const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regex)
    return (match&&match[7].length==11) ? match[7] : false;
  }

  function createIFrame(){
      const parsedURL = parseURL(textInput)
      console.log(parsedURL)

      // Creates an <iframe> (and YouTube player)
      player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: parsedURL,
          events: {
              'onPlayerReady': onPlayerReady,
              'onStateChange': onPlayerStateChange,
          }
      });   
      
      
  }

  function onPlayerReady() { 
      player.playVideo();
  }

  function onPlayerStateChange(event) {
      if(event.data == 0){
          player.destroy();
      }
  }
}

export default Media