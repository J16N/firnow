import React from "react"
import Home from "../components/MainPage/Home"
import Wrapper from "../components/wrapper/Wrapper"
import News from "../components/news/News"
import Achievements from '../components/achievements/Achievements'



const Pages = ({ productItems, addToCart, CartItem }) => {
  return (
    <>
      {/* <Home CartItem={CartItem} />
      <FlashDeals productItems={productItems} addToCart={addToCart} />
      <TopCate />
      <NewArrivals />
      <Discount />
      <Shop shopItems={shopItems} addToCart={addToCart} />
      <Annocument />
      <Wrapper /> */}
      <Home CartItem={CartItem} />
      <News />
      <Achievements/>
      <Wrapper />
    </>
  )
}

export default Pages
