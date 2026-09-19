import React from 'react'
import { Link, NavLink } from "react-router-dom";
import "../css/footer.css"

const Footer = () => {
  return (
    <div className='footer-container'>
        <nav className='footer-about'>
            About WordFlux
            <ul>
              <li>
                  <NavLink to="/">About</NavLink>
              </li>
              <li>
                <li>
                    <NavLink to="/">Contact</NavLink>
                </li>
              </li>
            </ul>
        </nav>
        <NavLink to="/">WordFlux</NavLink>
    </div>
  )
}

export default Footer