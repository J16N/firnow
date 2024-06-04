import React from "react"
import "./Home.css"
import SliderHome from "./Slider"

const Home = () => {
  return (
    <>
      <section className='home'>
        <h2 className="heading-just animate-charcter"> Welcome to FirNOW</h2>
        <div className='container d_flex'>
          <SliderHome />
        </div>
      </section>
    </>
  )
}

export default Home
