import React, { useContext, useEffect, useState } from "react";
import Card from "../components/Status/Card.jsx";
// import StatusData from "./StatusData.jsx";
import "./status.css";
import { Web3ApiContext } from "../web3Context/apiContext.js";

export default function Status() {
  const [StatusData, setStatusData] = useState([]);

  const { getFIRbyVictim } = useContext(Web3ApiContext);

  useEffect(() => {
    getFIRbyVictim()
      .then((res) => {
        console.log(res);
        setStatusData(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <>
      <div className="status-container">
        {StatusData.map((fir) => {
            console.log(fir)
          return (
            <>
              <Card
                name={fir.subject}
                status={fir.status}
                data={fir.description}
              ></Card>
            </>
          );
        })}
      </div>
    </>
  );
}
