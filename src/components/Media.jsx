import React, { useStatem, useEffect, useState } from 'react'
import { useGlobalContext } from '../context';
const Media = () => {
  
  var player;
  const {textInput, setTextInput} = useGlobalContext()
  const [data, setData] = useState(null)
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
      }).then(res => res.json()).then(data => console.log(data))
      //fetch(`/api/test`).then(res => res.json).then(data => console.log("data"))
    }, 5000);

    return () => {
      clearTimeout(timerId);
    };

  }, [])
 
  return (
    <>
        
        <div>
          <div id="player"></div>
          {/* <div>{data.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </div> */}
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
      // Creates an <iframe> (and YouTube player)
      player = new YT.Player('player', {
          height: '390',
          width: '640',
          videoId: parsedURL,
          events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange,
          }
      });      
  }

  function onPlayerReady(event) { 
    event.target.playVideo();
    
    console.log(event.target.getCurrentTime())
  }

  function onPlayerStateChange(event) {
    
    if(event.data == 0){
        player.destroy();
    }
    if(event.data == YT.PlayerState.PLAYING){
      console.log(event.target.getCurrentTime())
    }
      
  }
}

export default Media