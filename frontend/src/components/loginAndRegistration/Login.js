import React, { Component } from 'react';
import $ from 'jquery'
import styles from './LoginAndRegistration.css';
// import './App.css'



class Login extends Component {

	constructor(props) {
    super(props);
    this.state = {
			user     : "",
			password : ""
		};
		this.api_login = this.api_login.bind(this);
	}
	

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
		// console.log(this.state);	
	}

	api_login(){
		
		$.ajax({ 
			method: "POST", 
			url: "/api/login", 
			contentType:"application/json; charset=utf-8",
			dataType: "json", 
			data: JSON.stringify({ "user": this.state.user , "password": this.state.password })
		}).done(function(data, text_status, jqXHR){
			this.props.view(this.state.user,this.state.password);
		}.bind(this)).fail(function(err){
			let response = {};
			if("responseJSON" in err)response = err.responseJSON;
			else response = { error: { "Server Error" : err.status } };
			console.log(response);
		

			this.setState((prevState, props) => ({
				user: "",
				password: ""
			}));
		}.bind(this));
	}


  render() {
    return (
			<div className={styles.ui_top} id="ui_login">
				<h2>Login</h2>
				<div className={styles.form_top}>
					<div className={styles.form_row}>
						<label>user</label>
						<input onChange={this.handleChange} type="text" name="user" placeholder="User Name" />
					</div>
					<div className={styles.form_row}>
						<label>password</label>
						<input onChange={this.handleChange} type="password" name="password" placeholder="Password" />
					</div>
					<div className={styles.form_row}>
						<input type="submit" id="loginSubmit" value="Login" onClick={this.api_login.bind(this)} />
					</div>

					{/* <thead>
						<div className="form-errors" colspan="2"></div>
					</thead> */}
					
				</div>
			</div>
    );
  }
}

export default Login;
