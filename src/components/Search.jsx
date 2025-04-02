import React, { useState } from 'react'
import "../css/search.css"
import Media from './Media'
import { Link } from "react-router-dom";
import { useGlobalContext } from '../context';

const Search = () => {

    const {setTextInput} = useGlobalContext()

    return (
        <div className='wrap'>
            <div className='input-wrapper'>
                <input type='text' id="textbox_id" placeholder='Type in a YouTube link' onChange={(e) => setTextInput(e.target.value)}></input>
                <Link to="/media">
                    <button>Go</button>
                </Link>  
            </div>
        </div>
    )

    
}

export default Search   