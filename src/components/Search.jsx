import React, { useContext, useState } from 'react'
import "../css/search.css"
import Media from './Media'
import { Link } from "react-router-dom";
import { GlobalContext } from '../context';
import { Navbar } from './Navbar';
import { AuthContext } from '../AuthContext';

const Search = () => {

    const {setTextInput} = useContext(GlobalContext)
    //const {user} = useContext(AuthContext)

    return (
        <>
            <Navbar />
            <div className='wrap'>
                <div className='input-wrapper'>
                    <input type='text' id="textbox_id" placeholder='Type in a YouTube link' onChange={(e) => setTextInput(e.target.value)}></input>
                    <Link to="/media">
                        <button>Go</button>
                    </Link>  
                </div>
                {/* <div>
                    <p>{user}</p>
                </div> */}
            </div>
        </>
    )

    
}

export default Search   