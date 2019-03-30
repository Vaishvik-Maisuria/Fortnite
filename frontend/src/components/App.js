import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import styles from './App.css';
import LoginDashBoard from './loginAndRegistration/LoginDashBoard'
import GameBoard from './gameFolder/GameBoard'


class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            
            isGameStarted: false,
            isNotLogedIn: true,
        };
        this.Loginhandler = this.Loginhandler.bind(this);
    }

    // This method will be sent to the child component
    Loginhandler() {
        this.setState({
           
            isGameStarted: true,
            isNotLogedIn: false
        });
    }

    render() {
        return (
            <div>
                {this.state.isNotLogedIn && <LoginDashBoard  view={this.Loginhandler.bind(this)}/>}
                {this.state.isGameStarted && <GameBoard />}
            </div>
        );
    }
}


export default hot(module)(App);
