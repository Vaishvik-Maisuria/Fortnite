import React, { Component } from 'react';
import Login from './Login';
import Registration from './Registration';
import styles from '../App.css'


class LoginDashBoard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoginOpen: false,
      isRegisterOpen: true,
    };
    this.changeView = this.changeView.bind(this);
  }

  showLoginBox() {
    this.setState({isLoginOpen: true, isRegisterOpen: false});
  }

  showRegisterBox() {
    this.setState({isRegisterOpen: true, isLoginOpen: false});
  }

  changeView = (user, password) => {
    this.props.view(user, password);
  }

  


  render() {

    const loginDiv = this.state.isLoginOpen? <div
    className={styles.selected_controller}
    onClick={this.showLoginBox.bind(this)}> 
    Login
    </div> : <div
    className={styles.controller}
    onClick={this.showLoginBox.bind(this)}> 
    Login
    </div>
      const registerDiv = this.state.isRegisterOpen ? <div
      className={styles.selected_controller}
      onClick={this.showRegisterBox.bind(this)}> 
      Register
      </div> : <div
      className={styles.controller}
      onClick={this.showRegisterBox.bind(this)}> 
      Register
      </div>


    return (
      <div className={styles.center}>
        <div className={styles.box_container}>
          <div className={styles.box_controller}>
            {loginDiv}
            
            {registerDiv}
            
          </div>
          
          {this.state.isLoginOpen && <Login view={this.changeView.bind(this)}/>}
          {this.state.isRegisterOpen && <Registration login = {this.showLoginBox.bind(this)}/>}
        </div>
      </div>
      
    );
  }
}

export default LoginDashBoard;
