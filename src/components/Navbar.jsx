import React from 'react'
import { Link, NavLink } from "react-router-dom";

import "../css/navbar.css"

export const Navbar = () => {
  return (
    <nav className='nav'>
        <NavLink to="/">WordFlux</NavLink>
        <ul>
          <li>
              <NavLink to="/saved">Saved Videos</NavLink>
          </li>
          <li>
              <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <label>
              {'🌐 '} 
              <select>
                <option value="english">English</option>
              </select>
            </label>
          </li>
        </ul>
    </nav>
  )
}

