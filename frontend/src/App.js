import React, { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./common/header/Header";
import Pages from "./pages/Pages";
import Data from "./components/Data";
import Cart from "./common/Cart/Cart";
import Footer from "./common/footer/Footer";
import LodgeFir from "./components/lodgeFir/LodgeFir";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/police-station/Login.jsx";
import Register from "./pages/police-station/Register.jsx";
import Status from "./pages/Status.jsx";
import VerifyEmail from "./pages/police-station/VerifyEmail.jsx";

function App() {
  const { productItems } = Data;

  const [CartItem, setCartItem] = useState([]);

  const addToCart = (product) => {
    const productExit = CartItem.find((item) => item.id === product.id);
    if (productExit) {
      setCartItem(CartItem.map((item) => (item.id === product.id ? { ...productExit, qty: productExit.qty + 1 } : item)));
    } else {
      setCartItem([...CartItem, { ...product, qty: 1 }]);
    }
  };

  const decreaseQty = (product) => {
    const productExit = CartItem.find((item) => item.id === product.id);
    if (productExit.qty === 1) {
      setCartItem(CartItem.filter((item) => item.id !== product.id));
    } else {
      setCartItem(CartItem.map((item) => (item.id === product.id ? { ...productExit, qty: productExit.qty - 1 } : item)));
    }
  };

  return (
    
      <Router>
        <Header CartItem={CartItem} />
        <Routes>
          <Route path='/' element={<Pages productItems={productItems} addToCart={addToCart} />} exact />
          <Route path='/lodgeFir' element={<LodgeFir />} />
          <Route path='/police-station/dashboard' element={<Dashboard />} />
          <Route path='/police-station/register' element={<Register />} />
          <Route path='/police-station/login' element={<Login></Login>} />
          <Route path='/police-station/verify-email' element={<VerifyEmail></VerifyEmail>} />
          <Route path='/status' element={<Status></Status>}/>
        </Routes>
        <Footer />
      </Router>
  );
}

export default App;
