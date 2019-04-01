import React, { Component } from 'react';
import styles from '../App.css';



class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {

    return (
      <div className={styles.center}>
        <div class={styles.ui_top} id="ui_play">
          <center>
            {/* <canvas id="stage" width="700" height="700" style="border:1px solid black;"> </canvas> */}
          </center>
        </div>
      </div>
    );
  }
}

export default Game;
