import React, { Component } from 'react';
import styles from '../App.css';
import $ from 'jquery'
import { draw, mouseMove, getMousePos, getTouchPos } from './drawing'
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
      width: window.innerWidth,
      windowHeight: window.screen.availHeight - 200,
      windowWidth: window.screen.availWidth - 22,
      isMobile: false,
      socket: null,
      socketOpen: false,
      id: ID(),
      hasError: false,
      acceleration: {
        x: 0,
        y: 0,
        z: 0,
      },
      accelerationIncludingGravity: {
        x: 0,
        y: 0,
        z: 0,
      },
      interval: 0,
      rotationRate: {
        alpha: 0,
        beta: 0,
        gamma: 0,
      },
      player: null,
      playerIndex: 0,
      mouseInterval: null,
      playerDead: false,
      mouseMovementData: {
        playerIndex: null,
        id: 0,
        type: 'none',
        x: 0,
        y: 0
      },
      totalKills: 0
    };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  componentDidMount() {
    if (this.state.width <= 500) {
      this.setState({
        isMobile: true
      })
    };

    if (this.state.playerDead) {
      this.props.goToStats()
    }
    const canvas = this.refs.canvas;

    this.initializeSocketOperations(canvas);

    document.addEventListener('keydown', this.handleKeyPress)
    canvas.addEventListener("click", this.handleMouseClick);
    canvas.addEventListener("mousemove", this.handleMouseMovement);

    // // touch listensers 
    // canvas.addEventListener('touchmove', this.handleTouchMove)
    canvas.addEventListener('touchstart', this.handleTouchStart);

    // device motion 
    setTimeout(() => { window.addEventListener('devicemotion', this.handleDeviceMotion, true);}, 200)
    window.addEventListener('devicemotion', this.handleDeviceMotion, true);

    var intVal = setInterval(() => {
      
      this.sendData(this.state.mouseMovementData)
    }, 400)

    this.setState({
      mouseInterval: intVal
    })

  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
    const socket = new WebSocket("ws://142.1.2.146:8001")
    setTimeout(() => { }, 1500)

    this.setState({
      socket: socket
    })
  }



  componentWillUnmount() {
    clearInterval(this.state.mouseInterval)
    //Player is dead
    const data = {
      type: 'deadPlayer',
      playerIndex: this.state.playerIndex
    }

    this.sendData(data)

    clearInterval(this.state.mouseInterval)
    this.setState({
      playerDead: true,
      totalKills: 0
    })

    setTimeout(this.state.socket.close(), 3000)

    this.updateDeathsDatabase();

    window.removeEventListener('resize', this.handleWindowSizeChange);
    window.removeEventListener('devicemotion', this.handleDeviceMotion, true);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };


  updateKillsDatabase = () => {

    let send = { "Username": this.props.user, "Score": this.state.totalKills }

    $.ajax({
      method: "PUT",
      url: "/api/addKills/user=" + this.props.user,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(send),
    }).done(function (data, text_status, jqXHR) {


    }).fail(function (err) {
      let response = {};
      if ("responseJSON" in err) response = err.responseJSON;
      else response = { error: { "Server Error": err.status } };
    });
  }

  updateDeathsDatabase = () => {
    let send = { "Username": this.props.user, "Score": 0 }
    $.ajax({
      method: "PUT",
      url: "/api/addDeath/user=" + this.props.user,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(send),
    }).done(function (data, text_status, jqXHR) {
      // do nothing
    }).fail(function (err) {
      let response = {};
      if ("responseJSON" in err) response = err.responseJSON;
      else response = { error: { "Server Error": err.status } };
    });
  }

  handleDeviceMotion = event => {
    const { acceleration, accelerationIncludingGravity, interval, rotationRate } = event;
    this.setState({ acceleration, accelerationIncludingGravity, interval, rotationRate })

    var x = Math.round(accelerationIncludingGravity.x) / 2;
    var y = Math.round(accelerationIncludingGravity.y) / 2;
    var z = Math.round(accelerationIncludingGravity.z) /2 ;
    const keyPressData = {
      x: -x,
      y: y,
      id: this.state.id,
      playerIndex: this.state.playerIndex,
      type: 'none'
    }
    
    if (z > 7) {
      keyPressData.type = "pickup"
    } else {
      keyPressData.type = 'movement'
    }
    this.sendData(keyPressData)
    this.setState({
      mouseMovementData: keyPressData,
    })
  };


  handleTouchStart = (event) => {
    const canvas = this.refs.canvas;
    var mousePos = getTouchPos(canvas, event);
    event.preventDefault();
    const mouseMovementData = {
      playerIndex: this.state.playerIndex,
      id: this.state.id,
      type: 'touchClick',
      x: mousePos.x,
      y: mousePos.y
    }
    this.setState({
      mouseMovementData: mouseMovementData,
      player: mouseMove(mouseMovementData.x, mouseMovementData.y, this.state.player, this.state.windowWidth, this.state.windowHeight)
    })
    this.sendData(mouseMovementData)
   
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
    this.setState({
      mouseMovementData: mouseMovementData,
      player: mouseMove(mousePos.x, mousePos.y, this.state.player, 700, 700)
    })
  }

  handleKeyPress = (event) => {
    var key = event.key;
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

      this.sendData(keyPressData)
    }
  }

  initializeSocketOperations = (canvas) => {
    this.state.socket.onopen = function (event) {
      const data = {
        type: 'userName',
        id: this.state.id

      }
      this.setState({
        socketOpen: true
      })
      this.sendData(data)
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

        if (config[playerIndex].dead) {
          //Player is dead
          const data = {
            type: 'deadPlayer',
            playerIndex: playerIndex
          }
          // clear the interval
          clearInterval(this.state.mouseInterval)

          this.sendData(data)

          // this closes the socket 
          this.state.socket.close()

          this.setState({
            playerDead: true,
            totalKills: config[playerIndex].kills
          })

          this.updateKillsDatabase();
          this.props.goToStats()
        } else {
          if (this.state.playerIndex != playerIndex || this.state.player == null) {
            //assign the new player
            this.setState({
              player: config[playerIndex],
              playerIndex: playerIndex
            })

            if (this.state.isMobile) {
              draw(context, config, playerIndex, config[playerIndex], this.state.windowWidth, this.state.windowHeight) //on the initial Drawing
            } else {
              draw(context, config, playerIndex, config[playerIndex], 700, 700) //on the initial Drawing
            }
          } else {
            //change the position
            //we only want the turretDirection
            var temp = config[playerIndex]
            temp.turretDirection = this.state.player.turretDirection
            if (!this.state.isMobile) {
              temp.turretDirection = this.state.player.turretDirection
            }
            this.setState({
              player: temp
            })
            //player has been assigned
            if (this.state.isMobile) {
              draw(context, config, playerIndex, temp, this.state.windowWidth, this.state.windowHeight) //after the state has changed
            } else {
              draw(context, config, playerIndex, temp, 700, 700) //on the initial Drawing
            }

          }
        }

      }
    }.bind(this);
    this.state.socket.onerror = function (event) {
      this.state.socket.close()
    }
    this.state.socket.onclose = function (event) {
      console.log("Socket should be closed")
      this.setState({
        socketOpen: false
      })

    }.bind(this)
  }

  sendData = (data) => {
    const sData = JSON.stringify(data)
    if (this.state.socketOpen) {
      this.state.socket.send(sData)
    }
    // this.state.socket.onopen = function (event) {


  }
  render() {
    const { width } = this.state;
    const isMobile = width <= 500;

    if (isMobile) {
      return (
        <div className={styles.center}>
          <div class={styles.ui_top} id="ui_play">
            <center>
              <canvas ref="canvas"
                width={this.state.windowWidth} height={this.state.windowHeight}
                style={{ border: '1px solid black' }}
              />
            </center>
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.center}>
          <div class={styles.ui_top} id="ui_play">
            <center>
              <canvas ref="canvas"
                width={700} height={700}
                style={{ border: '1px solid black' }}
              />
            </center>
          </div>
        </div>
      );
    }
  }
}

export default Game;
