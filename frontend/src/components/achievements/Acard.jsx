import React from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Adata from "./Adata"
import "./style.css"
import "../achievements/achievements.css"


const Ncard = () => {

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
  }
  return (
    <>
      <Slider {...settings}>
        {Adata.map((value, index) => {
          return (
            <>
            <div className='box product img-achi-main' style={{backgroundImage: `url(${value.cover})`, backgroundSize:'cover', backgroundRepeat: 'no-repeat', }}>
            <div className='box product img-achi' key={index} >
                <h2 style={{textAlign:"center", color: "black", fontWeight: "bold"}}>{value.title}</h2><br/>
                <h4 style={{fontFamily: "serif", fontSize: "20px", marginBottom: "15px", color: "black", fontWeight: "bold"}}>{value.name}</h4>
                <p style={{textAlign:"right", color: "black", fontWeight: "bold"}}><b>Award in : {value.year}</b></p>
              </div>
              </div>
            </>
          )
        })}
      </Slider>
    </>
  )
}

export default Ncard
