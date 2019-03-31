import React, { Component } from 'react';
import styles from '../App.css';
import NavBar from './NavBar';
import Game from './Game';
import Profile from './Profile';
import Stats from './Stats';
import Instructions from './Instructions';


class GameBoard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      view: "Game"
    };
    this.changeView = this.changeView.bind(this);
  }

  changeView = (viewSelect) => {

    if(viewSelect == "LogOut"){
      this.props.logout();     
    }
    this.setState({
      view: viewSelect,
    });
  }

  render() {
    if (this.state.view === 'Game') {
      return (
        <div className={styles.center}>
          <NavBar view={this.changeView.bind(this)} />
          <Game />
        </div>
      );
    }
    if (this.state.view === 'Instruction') {
      return (
        <div className={styles.center}>
          <NavBar view={this.changeView.bind(this)} />
          <Instructions />
        </div>
      );
    }
    if (this.state.view === 'Stats') {
      return (
        <div className={styles.center}>
          <NavBar view={this.changeView.bind(this)} />
          <Stats />
        </div>
      );
    }
    if (this.state.view === 'Profile') {
      return (
        <div className={styles.center}>
          <NavBar view={this.changeView.bind(this)} />
          <Profile user={this.props.user} password={this.props.password} />
        </div>
      );
    }
  }
}

export default GameBoard;
