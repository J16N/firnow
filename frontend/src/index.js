import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Web3ApiProvider from "./web3Context/apiContext";

ReactDOM.render(
  <React.StrictMode>
    <Web3ApiProvider>
      <App />
    </Web3ApiProvider>
  </React.StrictMode>,
  document.getElementById("root")
);