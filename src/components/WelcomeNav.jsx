import React from 'react'
import { Link, NavLink } from "react-router-dom";

import "../css/navbar.css"

const WelcomeNav = () => {
    return (
      <nav className='navbar'>  
            <div className="navbar-wf">
              <NavLink to="/">WordFlux</NavLink>
            </div>
            <ul className="navbar-links">
              <li className="nav-item">
                  <NavLink to="/login"><span>Login</span></NavLink>
              </li>
              <li className="nav-item">
                <li>
                    <NavLink to="/signup"><span>Sign Up</span></NavLink>
                </li>
              </li>
            </ul>
        </nav>
      )
}

export default WelcomeNav