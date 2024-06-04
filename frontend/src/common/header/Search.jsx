import React from "react"
import logo from "../../components/assets/images/logo.svg"
import { Link } from "react-router-dom"
import Navbar from "./Navbar"

const Search = ({ CartItem }) => {
  // fixed Header
  window.addEventListener("scroll", function () {
    const search = document.querySelector(".search")
    search.classList.toggle("active", window.scrollY > 100)
  })

  return (
    <>
       <section className='search'>
        {/* <div className='container c_flex'>
          <div className='logo width '>
            <h2 style={{color: "purple"}}><i class="fab fa-linode fa-pulse fa-lg"></i> FirNOW</h2>
          </div> */}
          {/* 
          <div className='search-box f_flex'>
            <i className='fa fa-search'></i>
            <input type='text' placeholder='Search news' />
            <span>Go Click</span>
          </div>

          <div className='icon f_flex width'>
            <i className='fa fa-user icon-circle'></i> */}
            {/* <div className='cart'>
              <Link to='/cart'>
                <i className='fa fa-shopping-bag icon-circle'></i>
                <span>{CartItem.length === 0 ? "" : CartItem.length}</span>
              </Link>
            </div> */}
          {/* </div>
        </div>
        <br/> */}
      <Navbar />
        
      </section>

    </>
  )
}

export default Search
