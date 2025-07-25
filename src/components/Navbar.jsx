import React from 'react'
import { Link, NavLink } from "react-router-dom";

import "../css/navbar.css"

export const Navbar = () => {
  return (
    <nav>
        <NavLink to="/" className='navbar'>Home</NavLink>
        <label>
          {'🌐 '} 
          <select>
            <option value="english">English</option>
          </select>
        </label>
        <ul>
            <li>
                <NavLink to="/saved">Saved Videos</NavLink>
            </li>
        </ul>
    </nav>
  )
}

