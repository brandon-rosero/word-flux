import React, { useStatem, useEffect } from 'react'
import { useGlobalContext } from '../context';
// <button onClick={createIFrame}>Go</button>
const Media = () => {
  
  var player;
  const {textInput, setTextInput} = useGlobalContext()

  useEffect(() => {

    createIFrame()

  }, [])
  
  return (
    <>
        
        <div>
          <div id="player"></div>
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