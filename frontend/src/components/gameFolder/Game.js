import React, { Component } from 'react';
import styles from '../App.css';
import { draw } from './drawing'
// import GameController from './GameController';
// import WebSocket from 'ws'

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      id: "Nigger",
    };
  }

  componentWillMount () {
    this.setState({
      socket: new WebSocket("ws://localhost:8001")
    })
  }

  componentDidMount () {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    
    this.initializeSocketOperations(canvas)
   
  }

  initializeSocketOperations = (canvas) => {
    this.state.socket.onopen = function (event) {
      console.log('Defining onOpen');
      console.log("Sending in id", this.state.id);
      const id = this.state.id
      
      const data = {
        type: 'userName',
        id: this.state.id
      }
      this.sendData(data)
      
      console.log("connected");
    }.bind(this);

    this.state.socket.onmessage = function (event) {	
      //when a message has been relased
      var item = JSON.parse(event.data)
    
      const config = item.data
      const ids = config[0].stage.playersID
      console.log(ids);
      
      const id = this.state.id
      var context = canvas.getContext('2d')
      if (ids.includes(id)){
        console.log('in drawing');
        console.log('Players Index', ids.indexOf(id));
        //Player is in there
        const playerIndex = ids.indexOf(id)
        draw(context,config, playerIndex )
      }
  
    }.bind(this)


  }

  sendData = (data) => {
    // data.type = 'initialConnection'
    data['id'] = this.state.id
    const sData = JSON.stringify(data)
    this.state.socket.send(sData)
  }


  render() {

    return (
      <div className={styles.center}>
        <div class={styles.ui_top} id="ui_play">
          <center>
            <canvas ref="canvas" 
                    width={700} height={700} 
                    style={{border: '1px solid black'}}                    
                    />
            {/* <canvas id="stage" width="700" height="700" style="border:1px solid black;"> </canvas> */}
          </center>
        </div>
      </div>
    );
  }
}

export default Game;
