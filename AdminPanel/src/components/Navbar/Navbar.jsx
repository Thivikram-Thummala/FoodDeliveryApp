import React from 'react'
import "./Navbar.css"
import {assets} from '../../assets/assets'
const Navbar = () => {
  return (

    <div className="navbar">
      <div className="logodisp">
      <h3 className="logo">Swiggato
      </h3>
      <h4>Admin Panel</h4>
      </div>
      
      <img src={assets.profile_image} alt="" className="profile" />
    </div>

  )
}

export default Navbar
