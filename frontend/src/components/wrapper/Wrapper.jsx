import React from "react"
import "./style.css"
import "../Status/Card.css"

const Wrapper = () => {
  const data = [
    {
      cover: <i class="fa-brands fa-ethereum"></i>,
      title: "Web3 based",
      decs: "Web3 Integration for Transparent and Secure Citizen-Police Interactions",
    },
    {
      cover: <i class='fa-solid fa-id-card'></i>,
      title: "Safety of victim",
      decs: "Safety of victim ensured through robust security measures in place.",
    },
    {
      cover: <i class='fa-solid fa-shield'></i>,
      title: "Secure your info ",
      decs: "Secure your information with encrypted data storage and blockchain technology.",
    },
    {
      cover: <i class='fa-solid fa-headset'></i>,
      title: "24/7 Support ",
      decs: "Access 24/7 support for immediate assistance and resolution of grievances.",
    },
  ]
  return (
    <>
      <section className='wrapper background'>
        <div className='container grid2'>
          {data.map((val, index) => {
            return (
              <div className='product' key={index} style={{borderTopRightRadius: '10px', borderBottomLeftRadius: '10px', borderTopLeftRadius: '100px', borderBottomRightRadius: '100px', border: '4px solid #69586C'}}>
                <div className='img icon-circle'>
                  <i>{val.cover}</i>
                </div>
                <div>
                <h3>{val.title}</h3>
                <p>{val.decs}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}

export default Wrapper
