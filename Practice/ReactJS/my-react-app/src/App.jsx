import { useState } from 'react'
import College from './College'
import './App.css'
import Anits from './assets/Anits.jpeg';


function App() {

    const headingStyle = {
    color: "blue",
    fontSize: "30px",
    marginLeft: "30px"
  };

  return(
    <>
      <img src={Anits} alt="anitsHeader"/>

      <h1 style={headingStyle}>
        College Details
      </h1>

      <College
      name="Anits"
      city="Vizag"
      />
    
    </>
  )
}

export default App
