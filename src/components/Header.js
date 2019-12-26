// Librairies
import React from 'react'
import { Link } from 'react-router-dom'

// Styles
import './Header.css'

const Header = () => {
    return (
        <div className="Header">
            <Link className="Header-Link" to="/pong">Pong</Link>
            <Link className="Header-Link" to="/snake">Snake</Link>
            <Link className="Header-Link" to="/test/1">Test Game</Link>
        </div>
    )
}

export default Header