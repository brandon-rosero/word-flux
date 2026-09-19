import React from 'react'
import WelcomeNav from './WelcomeNav'
import "../css/welcome.css"

import { useNavigate } from "react-router-dom";
import Footer from './Footer';

const Welcome = () => {
    
    const navigate = useNavigate();
  
    return (
    <>
        <WelcomeNav />
        <div className='welcome-container'>
            <h1 className='wordflux'>WordFlux</h1>
            <h3>Learn a language through the digital content you enjoy.</h3>
            <button className='sign-up-button' onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
        <Footer />
        
    </>
  )
}

export default Welcome