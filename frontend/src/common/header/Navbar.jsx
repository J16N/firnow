import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import police_logo from "../../components/assets/images/police_svg.svg";
import metamask_logo from "../../components/assets/images/metamask-icon.svg";
import { Web3ApiContext } from "../../web3Context/apiContext";
import { displayWalletAddress } from "../../utils/encodeAddress";

const Navbar = () => {
  // Toogle Menu
  const [MobileMenu, setMobileMenu] = useState(false);

  const { connectWallet, connectedAccount } = useContext(Web3ApiContext);

  return (
    <>
      <header className="header">
        <div className="container c_flex">
          {/* <div className='catgrories d_flex'>
            <span class='fa-solid fa-border-all'></span>
            <h4>
              Dashboard
            </h4>
          </div> */}
          <div className="logo_firnow width">
            {/* <img src={logo} alt='' /> */}
            <h2 style={{ color: "purple", fontSize: "30px", margin: '30px'}}>
              <i class="fab fa-linode fa-pulse fa-lg"></i> FirNOW
            </h2>
          </div>

          <div className="navlink">
            <ul
              className={
                MobileMenu ? "nav-links-MobileMenu" : "link f_flex capitalize"
              }
              onClick={() => setMobileMenu(false)}
            >
              {/*<ul className='link f_flex uppercase {MobileMenu ? "nav-links-MobileMenu" : "nav-links"} onClick={() => setMobileMenu(false)}'>*/}
              <li>
                <Link to="/">Home</Link>
              </li>
              {/* <li>
                <Link to='/news'>News</Link>
              </li> */}
              <li>
                <Link to="/status">Track Status</Link>
              </li>
              <li>
                <Link to="/police-station/dashboard">Dashboard</Link>
              </li>
              {/* <li>
                <Link to='/whyus'>Why Us</Link>
              </li> */}
              <li>
                <Link to="/lodgeFir">Lodge Fir</Link>
              </li>

              <Link to="/police-station/login" style={{marginRight:"1rem", marginTop:"0.2rem"}}>
                <img
                  width={35}
                  onClick={() => connectWallet()}
                  style={{ cursor: "pointer" }}
                  className="icon_button"
                  src={police_logo}
                  alt="police_logo"
                />
              </Link>
              <Link>
                <img
                  width={45}
                  onClick={() => connectWallet()}
                  style={{ cursor: "pointer" }}
                  className="icon_button"
                  src={metamask_logo}
                  alt=""
                />
              </Link>
            </ul>

            <button
              className="toggle"
              onClick={() => setMobileMenu(!MobileMenu)}
            >
              {MobileMenu ? (
                <i className="fas fa-times close home-btn"></i>
              ) : (
                <i className="fas fa-bars open"></i>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
