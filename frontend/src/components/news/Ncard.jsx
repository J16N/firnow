import React from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Ndata from "./Ndata"
import "./style.css"

const Ncard = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
  }
  return (
    <>
      <Slider {...settings}>
        {Ndata.map((value, index) => {
          return (
            <>
              <div className='box product' key={index} style={{ border: '6px solid #69586C'}}>
                <div className='img'>
                  <img style={{borderRadius: "20px", padding: "10px"}} src={value.cover} alt='' width='50%' height="50%" />
                </div>
                <h2 style={{textAlign:"center", paddingBottom: '20px'}}>{value.title}</h2>
                <h4>{value.name}</h4><br/>
                <p><b>Posted on : {value.date}</b></p>
                <span>Explore <i className="fa-solid fa-arrow-right" style={{marginLeft: "10px" }}></i></span>
              </div>
            </>
          )
        })}
      </Slider>
    </>
  )
}

export default Ncard
