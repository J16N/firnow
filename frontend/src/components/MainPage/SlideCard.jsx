import React from "react";
import Sdata from "./Sdata";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Status/Card.css";

const SlideCard = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    appendDots: (dots) => {
      return <ul style={{ margin: "0px" }}>{dots}</ul>;
    },
  };
  return (
    <>
      <Slider {...settings}>
        {Sdata.map((value, index) => {
          return (
            <>
              <div className="box d_flex top" key={index} style={{borderTopLeftRadius: '10px', borderBottomRightRadius: '10px', borderTopRightRadius: '200px', borderBottomLeftRadius: '200px', padding: '40px', backgroundColor:'#52137E', backgroundColor: '#7f53ac', backgroundImage: 'linear-gradient(315deg, #7f53ac 0%, #647dee 74%)'}}>
                <div className="left">
                  <h1 className="title">{value.title}</h1>
                  <p className="title">{value.desc}</p>
                  <br />
                  <button className="btn-primary" style={{backgroundColor: '#691883', padding: '20px 40px', marginLeft: '5px', borderBottomLeftRadius: '80px', borderTopRightRadius: '80px'}}>Explore More</button>
                </div>

                <div className="right img-slide-animation">
                  <img className="slideCover" src={value.cover} alt="" />
                </div>
              </div>
              <br />
              <br />
            </>
          );
        })}
      </Slider>
      <br />
      <br />
    </>
  );
};

export default SlideCard;
