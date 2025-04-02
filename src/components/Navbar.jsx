import React from 'react'
import { Link, NavLink } from "react-router-dom";
import "../css/navbar.css"

export const Navbar = () => {
  return (
    <nav>
        <NavLink to="/" className='navbar'>Home</NavLink>
        <ul>
            <li>
                <NavLink to="/saved">Saved Videos</NavLink>
            </li>
        </ul>
    </nav>
  )
}

