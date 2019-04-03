import React, { Component } from 'react';
import styles from '../App.css';
import { draw, mouseMove, getMousePos } from './drawing'
// import GameController from './GameController';
// import WebSocket from 'ws'
var moveMap2 = {
  'a': [-1, 0],
  's': [0, 1],
  'd': [1, 0],
  'w': [0, -1],
  'e': [0, 0]
};
function ID() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      id: ID(),
      player: null,
      playerIndex: 0,
      mouseMovementData: {
        playerIndex: null,
        id: 0,
        type: 'none',
        x: 0,
        y: 0
      }
    };
  }

  componentWillMount() {
    this.setState({
      socket: new WebSocket("ws://142.1.3.167:8001")
    })
  }

  componentDidMount() {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");

    this.initializeSocketOperations(canvas)
    document.addEventListener('keydown', this.handleKeyPress)
    // document.addEventListener('mouseMove', this.handleMouseMovement)
    canvas.addEventListener("click", this.handleMouseClick);
    canvas.addEventListener("mousemove", this.handleMouseMovement);
    setInterval(() => {
      this.sendData(this.state.mouseMovementData)
    }, 400)

  }

  handleMouseClick = (event) => {
    const canvas = this.refs.canvas;
    var mousePos = getMousePos(canvas, event);
    const mouseMovementData = {
      playerIndex: this.state.playerIndex,
      id: this.state.id,
      type: 'mouseClick',
      x: mousePos.x,
      y: mousePos.y
    }
    // console.log('mouse clicked');
    
    this.sendData(mouseMovementData)

  }



  handleMouseMovement = (event) => {
    const canvas = this.refs.canvas;
    var mousePos = getMousePos(canvas, event);

    const mouseMovementData = {
      playerIndex: this.state.playerIndex,
      id: this.state.id,
      type: 'mouseMovement',
      x: mousePos.x,
      y: mousePos.y
    }
    // console.log(mouseMovementData);
    this.setState({
      mouseMovementData: mouseMovementData,
      player: mouseMove(mousePos.x, mousePos.y, this.state.player)
    })
    // console.log("Mouse moving");

  }

  handleKeyPress = (event) => {
    var key = event.key;
    console.log(this.state.id);

    if (key in moveMap2) {
      const keyPressData = {
        x: moveMap2[key][0],
        y: moveMap2[key][1],
        id: this.state.id,
        playerIndex: this.state.playerIndex,
        type: 'none'
      }

      if (key == 'e') {
        keyPressData.type = 'pickup'
      } else {
        keyPressData.type = 'movement'
      }
      // stage.player.setDirection(moveMap[key].dx, moveMap[key].dy);
      // console.log("Key is pressed");
      this.sendData(keyPressData)
    }



  }

  initializeSocketOperations = (canvas) => {
    this.state.socket.onopen = function (event) {

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
      const id = this.state.id

      var context = canvas.getContext('2d')
      if (ids.includes(id)) {

        const playerIndex = ids.indexOf(id)
        if (config[playerIndex].dead){
          //Player is dead
          const data = {
            type: 'deadPlayer',
            playerIndex: playerIndex
          }
          this.sendData(data)
          this.state.socket.close()
          console.log('Player is dead');
          
          
        }else {
        
          if (this.state.player == null || this.state.playerIndex != playerIndex) {
            //assign the new player
            this.setState({
              player: config[playerIndex],
              playerIndex: playerIndex
            })
            // console.log('#-----------------', config[playerIndex]);
            
            draw(context, config, playerIndex, config[playerIndex]) //on the initial Drawing
          } else {
            //change the position
            //we only want the turretDirection
            var temp = config[playerIndex]
            temp.turretDirection = this.state.player.turretDirection
            // var temp = this.state.player
            // temp.position = config[playerIndex].position

            this.setState({
              player: temp
            })
            //player has been assigned
            draw(context, config, playerIndex, temp) //after the state has changed
          }
        }

      }
    }.bind(this)


  }

  sendData = (data) => {
    // data.type = 'initialConnection'
    // console.log();

    // data['id'] = this.state.id
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
              style={{ border: '1px solid black' }}
            />
            {/* <canvas id="stage" width="700" height="700" style="border:1px solid black;"> </canvas> */}
          </center>
        </div>
      </div>
    );
  }
}

export default Game;
