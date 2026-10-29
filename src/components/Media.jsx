import React, { useStatem, useEffect, useState, useContext } from 'react'
import { GlobalContext } from '../context';
import { Navbar } from './Navbar';
import "../css/word.css"
import "../css/ytText.css"
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner'
import { useLocation } from 'react-router-dom';
import HighlightText from './HighlightText';
import VocabModal from './VocabModal';
import API_URL from "../api.js";

const Media = () => {
  const location = useLocation()
  const {video_url, transcript, videoLanguage} = location.state || {}

  const [player, setPlayer] = useState();
  const [videoTitle, setVideoTitle] = useState();
  const [videoThumbnail, setVideoThumbnail] = useState();

  const {textInput, definitions, word, currentLexicalWords, setCurrentLexicalWords, setCurrentWord, setDefinitions} = useContext(GlobalContext)
  const [data, setData] = useState([])

  const [language, setLanguage] = useState("")
 
  const [message, setMessage] = useState();
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [cleanUrl, setCleanUrl] = useState()

  const executeSequence = async (vTitle, thumbnailUrl, cleanUrl) => {
    try{
      const transcribeRes = await fetch(`${API_URL}/api/transcribe`, { 
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',  
        },
        body: JSON.stringify({ data: cleanUrl, transcript: transcript, language: videoLanguage })
      });

      const transcribeData = await transcribeRes.json();
      const tScript = transcribeData[0]
      const lang = transcribeData[1]
      setData(transcribeData[0]);
      setLanguage(transcribeData[1]);

      const storeRes = await fetch(`${API_URL}/api/store_video`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({title: vTitle, input: cleanUrl, video_url: video_url,thumbnail_url: thumbnailUrl, transcription: tScript, language: lang})
      });

      const storeData = await storeRes.json();
      setMessage(storeData['message']);

      const interactionRes = await fetch(`${API_URL}/api/video_interaction`, { 
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',  
        },
        credentials: 'include',
        body: JSON.stringify({ input: cleanUrl, url: video_url, interaction: "view" })
      });

      const interactionData = await interactionRes.json();
      setMessage(interactionData['message']);

    } catch (error){
      console.error("An error occurred during the sequence:", error);
    }
  }
  

  useEffect(() => {
    const timerId = setTimeout(() => {
      createIFrame()
    }, 5000);
    return () => {
      clearTimeout(timerId);
    };
  }, [])
  
  useEffect(() => {
    let interacted = false;
    const interval = setInterval(() => {
      if (!player) return;
  
      const time = player.getCurrentTime();
      const duration = player.getDuration();
      const percentage = (time / duration) * 100;
      
      if(!interacted){
        if(percentage >= 50){
          interacted = true;
          fetch(`${API_URL}/api/video_interaction`, { 
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',  
            },
            credentials: 'include',
            body: JSON.stringify({ input: cleanUrl, url: video_url, interaction: "watch" })
          }).then(res => res.json()).then(data => {setMessage(data[0])})   
        }
      }
      const index = data.findIndex(
        (word) => time >= word.start && time <= word.end
      );
  
      setCurrentWordIndex((prev) =>
        index !== -1 && index !== prev ? index : prev
      );
    }, 100);
  
    return () => clearInterval(interval);
  }, [player, data]);

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
          <div className='yt-iframe-text-container'>
            <div className='yt-iframe' id="player"></div>
            {data?.length !== 0 ? <div className='btn-options'>
              <button className='save-vid-btn' onClick={handleVideoSave}>Save Video</button>
            </div> : <div></div>}
            {data?.length !== 0 ? <HighlightText transcript={data} currentWordIndex={currentWordIndex} language={language} url={cleanUrl} /> : <Oval
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
                />}
          </div>
            
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
          {word?.length !== 0 ? <div className='yt-definition-container'>
                <div><h1>{word}</h1>{definitions?.map((d, dIndex) => (
                  <div key={dIndex} className="definition-sentence">
                    {d.split(/\s+/).map((word, index) => <span key={index} className={currentLexicalWords.includes(removePunctuation(word)) ? 'def-span' : ''} onClick={() => handleLemmaClick(removePunctuation(word))}>{word}</span>)}
                  </div>
                  ))}</div>
                <button className='save-def-btn' onClick={() => setIsModalOpen(true)}>Create Flashcard</button>
              </div> : <div></div>}

          <VocabModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}></VocabModal>
        </div> 
        
      
    </>
  )

  function getWordDefinition(word, language){
    fetch(`${API_URL}/api/get_definitions`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify({word: word, language: language})
    }).then((res => res.json())).then(data => {setCurrentWord(data[0]); setDefinitions(data[1]); setCurrentLexicalWords(data[2])})
  }
  
  function handleLemmaClick(word){
    if(currentLexicalWords.includes(word)){
      getWordDefinition(word.toLowerCase(), language)
    }
  }

  function removePunctuation(str){
    return str.replace(/[:,.!?;"'-()]/g, "")
  } 

  function handleVideoSave(){
    fetch(`${API_URL}/api/save_video`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({title: videoTitle, video_url: cleanUrl, thumbnail_url: videoThumbnail, transcription: data, language: language})
    }).then(res => res.json()).then(data => setMessage(data['message']))
  }

  function parseURL(url){
    const regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regex)
    return (match&&match[7].length==11) ? match[7] : false;
  }

  function createIFrame(){
      let videoID = null
      if (video_url?.length === 0 || video_url == undefined){  
        videoID = parseURL(textInput)
      }
      else{
        
        videoID = parseURL(video_url)
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
    const videoID = videoData.video_id;
    const thumbnailUrl = `https://img.youtube.com/vi/${videoID}/0.jpg`;
    const cleanUrl = `https://www.youtube.com/watch?v=${videoID}`;
    setVideoTitle(videoTitle);
    setVideoThumbnail(thumbnailUrl);
    setCleanUrl(cleanUrl);
    executeSequence(videoTitle, thumbnailUrl, cleanUrl);
  }

  function onPlayerStateChange(event) {
    if(event.data == 0){
        player.destroy();
    }
  }
}

export default Media
