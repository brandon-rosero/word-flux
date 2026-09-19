import React from 'react'
import { Link, NavLink } from "react-router-dom";
import { Search, BookOpen, Info, Globe, Settings } from 'lucide-react';

import "../css/navbar.css"

export const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className="navbar-wf"> <NavLink to="/">WordFlux</NavLink></div>
        <ul className="navbar-links">
          <li className="nav-item">
              <NavLink to="/search"><Search /><span>Search</span></NavLink>
          </li>
          <li className="nav-item">
              <NavLink to="/saved"><BookOpen /><span>Library</span></NavLink>
          </li>
          <li className="nav-item">
              <NavLink to="/about"><Info /><span>About</span></NavLink>
          </li>
          <li className="nav-item">         
              <NavLink to="/settings"><Settings /><span>Settings</span></NavLink>     
          </li>
        </ul>  
    </nav>
  )
}

