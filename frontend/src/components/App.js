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
            user:"",
            password:"",
            isGameStarted: false,
            isNotLogedIn: true,
        };
        this.Loginhandler = this.Loginhandler.bind(this);
        this.LogOuthandler = this.LogOuthandler.bind(this);
    }

    // This method will be sent to the child component
    Loginhandler(user, password) {
       
        this.setState({
            user: user,
            password: password,
            isGameStarted: true,
            isNotLogedIn: false
        });
    }

    LogOuthandler() {
        this.setState({
            isGameStarted: false,
            isNotLogedIn: true
        });
    }

    render() {
        return (
            <div>
                {this.state.isNotLogedIn && <LoginDashBoard  view={this.Loginhandler.bind(this)}/>}
                {this.state.isGameStarted && <GameBoard user={this.state.user} password={this.state.password} logout={this.LogOuthandler.bind(this)}/>}
            </div>
        );
    }
}


export default hot(module)(App);
