import React from "react"
import Ncard from "./Ncard"
import "./news.css"

const News = () => {
  return (
    <>
      <section className='Discount background NewArrivals'>
        <div className='container'>
          <div className='heading d_flex'>
            <div className='heading-left row  f_flex'>
            <i className="fa-solid fa-newspaper icon-color"></i>
              <h2>News and Announcement</h2>
            </div>
            <div className='heading-right row '>
              {/* <span>View all</span>
              <i className='fa-solid fa-caret-right'></i> */}
            </div>
          </div>
          <Ncard />
        </div>
      </section>
    </>
  )
}

export default News
