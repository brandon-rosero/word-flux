import React, { useStatem, useEffect, useState, useContext } from 'react'
import { GlobalContext } from '../context';
import { Navbar } from './Navbar';
import "../css/word.css"
import "../css/ytText.css"
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner'
import { useLocation } from 'react-router-dom';

const Media = () => {
  const location = useLocation()
  const {video_url, transcript, videoLanguage} = location.state || {}

  const [player, setPlayer] = useState();
  const [videoTitle, setVideoTitle] = useState();
  const [videoThumbnail, setVideoThumbnail] = useState();

  const {textInput, setTextInput} = useContext(GlobalContext)
  const [data, setData] = useState([])
  const [time, setTime] = useState(0.0)
  const [language, setLanguage] = useState("")
  const [definitions, setDefinitions] = useState()
  const [word, setCurrentWord] = useState("")
  const [currentLexicalWords, setCurrentLexicalWords] = useState("")
  const [message, setMessage] = useState();

  useEffect(() => {
    const timerId = setTimeout(() => {
      createIFrame()
      fetch("http://127.0.0.1:5000/api/transcribe", { 
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',  
        },
        body: JSON.stringify({ data: textInput, transcript: transcript, language: videoLanguage })
      }).then(res => res.json()).then(data => {setData(data[0]); setLanguage(data[1]); player.playVideo()})
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

  useEffect(() =>{  
    if(message == "Video added to library"){
      toast.success('Video added to library', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    });
    }
    else if(message == "Video already in library"){
        toast.info('Video already in library', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    }  
    setMessage("")
  })  
 
  return (
    <> 
        <Navbar />
        <div className='yt-container'>
            <div className='yt-iframe-def-container'>
              <div className='yt-iframe' id="player"></div>
              <div className='btn-options'>
                <button className='save-vid-btn' onClick={handleVideoSave}>Save Video</button>
              </div>
              {word?.length !== 0 ? <div className='yt-definition-container'>
                <div>{word}{definitions?.map((d, dIndex) => (
                  <div key={dIndex} className="definition-sentence">
                    {d.split(/\s+/).map((word, index) => <span key={index} className={currentLexicalWords.includes(word) ? 'def-span' : ''} onClick={() => handleLemmaClick(word)}>{word}</span>)}
                  </div>
                  ))}</div>
                <button className='save-def-btn'>Save Definition</button>
              </div> : <div></div>}
            </div>
            <HighlightText transcript={data} currentTime={time}/>
            <ToastContainer 
                  position="bottom-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick={false}
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="dark"
                  transition={Bounce}
              /> 
        </div>
    </>
  )
  
  function handleVideoSave(){
    fetch("http://127.0.0.1:5000/api/save_video", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({title: videoTitle, video_url: textInput, thumbnail_url: videoThumbnail, transcription: data, language: language})
    }).then(res => res.json()).then(data => setMessage(data['message']))
  }

  function handleLemmaClick(word){
    if(currentLexicalWords.includes(word)){
      getWordDefinition(word.toLowerCase(), language)
    }
  }

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

  function HighlightText({transcript, currentTime}){
    return (
      data?.length !== 0 ? <div className='text'>
        {transcript?.map((word, index) => (
          <span key={index}
            className={
              currentTime >= word.start && currentTime <= word.end ? 'word' : ''
            }
            onClick={() => getWordDefinition(removePunctuation(word.word.toLowerCase()), language)}
          >
          {word.word}{' '}
          </span>

        ))}
      </div> : <Oval
              height={80}
              width={80}
              color="#5D3FD3"
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#AE9FE9"
              strokeWidth={2}
              strokeWidthSecondary={2}
              wrapperStyle={{ margin: '20px' }}
              wrapperClass="custom-loader"
                />  
    )
  }

  function removePunctuation(str){
    return str.replace(/[,.!?]/g, "", '')
  }

  function parseURL(url){
    const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regex)
    return (match&&match[7].length==11) ? match[7] : false;
  }

  function createIFrame(){
      let videoID = null

      if (textInput?.length === 0){
        videoID = parseURL(video_url)
        
      }
      else{
        videoID = parseURL(textInput)
      }
      
      setVideoThumbnail(`https://img.youtube.com/vi/${videoID}/0.jpg`)
      // Creates an <iframe> (and YouTube player)
      setPlayer(new YT.Player('player', {
          videoId: videoID,
          playerVars: {
            'rel': 0,
            'autoplay': 0,  
          }, 
          events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange,
          }
      }))     
  }

  function onPlayerReady(event) { 
    var videoData = event.target.getVideoData();
    var videoTitle = videoData.title;
    setVideoTitle(videoTitle);
  }

  function onPlayerStateChange(event) {
    if(event.data == 0){
        player.destroy();
    }
  }
}

export default Media