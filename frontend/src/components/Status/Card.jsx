import React from "react";
import './Card.css';

export default function Card(props){
    return(
       <>
        <div class="parent">
        <div class="card">
            {/* <div class="logo">
                <span class="circle circle1"></span>
                <span class="circle circle2"></span>
                <span class="circle circle3"></span>
                <span class="circle circle4"></span>
                <span class="circle circle5">
                    
                </span>

            </div> */}
            <div class="glass"></div>
            <div class="content">
                <span class="title">{props.name}</span>
                <span class="text">{props.data}</span>
            </div>
            <div class="bottom">
                
                <div class="social-buttons-container">
                    <button class="social-button .social-button1">
                       <h6>{props.status}</h6>
                    </button>
                </div>
                <div class="view-more">
                    <button class="view-more-button">View more</button>
                    <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"></path></svg>
                </div>
            </div>
        </div>
    </div>
       </>
    );
}