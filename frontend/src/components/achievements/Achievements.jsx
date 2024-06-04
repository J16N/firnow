import React from "react"
import Acard from "./Acard"

const News = () => {
  return (
    <>
      <section className='Discount background NewArrivals' style={{backgroundColor: 'white'}}>
        <div className='container'>
          <div className='heading d_flex'>
            <div className='heading-left row  f_flex'>
            <i class="fa-solid fa-trophy icon-color"></i>
              <h2>Achievements</h2>
            </div>
            <div className='heading-right row '>
              {/* <span>View all</span>
              <i className='fa-solid fa-caret-right'></i> */}
            </div>
          </div>
          <div>
          
          <Acard />
          </div>
        </div>
      </section>
    </>
  )
}

export default News
