import React from "react"
import "./style.css"

const Footer = () => {
  return (
    <>
      <footer>
        <div className='container grid2'>
          <div className='box'>
            <h1>FirNOW</h1>
            <p className="footer-text">Blockchain based Public Grievence System</p>
            <div className='icon d_flex'>
              
            </div>
          </div>

          <div className='box'>
            <h2>About Us</h2>
            <ul className="footer-text">
              <li>WEB 3</li>
              <li>Security and Privacy</li>
              <li>24*7 support</li>
            </ul>
          </div>
          <div className='box'>
            <h2>Developed by</h2>
            <ul className="footer-text">
              <li>Ananya Das </li>
              <li>Ishita Roy</li>
              <li>Jishan Bhattacharya </li>
              <li>Rwitesh Bera</li>
              <li>Priyanka Kothari </li>
            </ul>
          </div>
          <div className='box'>
            <h2>Institution</h2>
            <ul className="footer-text">
              <li>Academy of Technology </li>
              <li>Mentor : Swarup Sarkar</li>
              <li>E-mail: www.aot.edu.in</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
