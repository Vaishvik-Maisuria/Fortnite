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
        <div className={styles.box_controller}>
          <h2> Instructions Page </h2>
          <div class="form-top">
            <ul>
              <li> Move with <code>wasd</code> </li>
              <li> Boxes restore amunition and health, move next to them and press e </li>
              <li> Aim with your mouse </li>
              <li> Mouse click fires </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Instructions;
