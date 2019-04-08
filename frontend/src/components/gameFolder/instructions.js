import React, { Component } from 'react';
import styles from '../App.css';



class Instructions extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {

    return (
      <div className={styles.gameboard_container}>
   
          <h2> Instructions Page </h2>
          <div class="form-top">
            <ul>
              <li> Move with <code>wasd</code> </li>
              <li> Boxes restore amunition and health, move next to them and press e </li>
              <li> Aim with your mouse </li>
              <li> Mouse click fires </li>
            </ul>
            <h1>Device Movement</h1>
            <ul>
              <li> Move with tilting your device left to right to move to the direction of left to right. Similarly up and down</li>
              <li> Boxes restore amunition and health, move next to them and shake the phone up and down </li>
              <li> Aim and fire with your touching your screen </li>
             
            </ul>
          </div>
        </div>
 
    );
  }
}

export default Instructions;
