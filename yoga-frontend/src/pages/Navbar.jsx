import React from 'react'
import {NavLink} from 'react-router-dom'
import '../styles/navbar.css'

function Navbar() {
  return (
    <div className='navbar'>
            <div className="logo">
                <span id="logo1">Yogi</span>
                <span id="logo2">Verse</span>
            </div>
            <div className="nav">
                <NavLink to='/' className="nav-items">Home</NavLink>
                <NavLink to='/leaderboard' className="nav-items">Leaderboard</NavLink>
                <NavLink to='/dashboard' className="nav-items">Dashboard</NavLink>
            </div>
    </div>
  )
}

export default Navbar