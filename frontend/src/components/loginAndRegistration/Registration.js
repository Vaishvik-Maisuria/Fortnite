import React, { Component } from 'react';
import $ from 'jquery'
import styles from './LoginAndRegistration.css';
// import './App.css'

class Registration extends Component {

	constructor(props) {
    super(props);
    this.state = {
			user : "",
			password : "",
			confirmpassword: "",
			skill:"beginner",
			year: "",
			month: "",
			day: "",
			playmorning: "yes",
			playafternoon:"",
			playevening: ""
		};
  }
	

	api_register(){
		let data = this.state;
		if(data.user==""){
			let response = { error: { "name" : "name is required" } };			
			console.log(response);
			return;
		}
		$.ajax({ 
			method: "POST", 
			url: "/api/user/"+data.user, 
			contentType:"application/json; charset=utf-8",
			dataType: "json", 
			data: JSON.stringify(data)
		}).done(function(data, text_status, jqXHR){
			console.log(text_status); 
			console.log(jqXHR.status); 
			this.props.login();
			// showUI("#ui_login");
			/** console.log(JSON.stringify(data)); console.log(text_status); console.log(jqXHR.status); **/
		}).fail(function(err){
			let response = {};
			if("responseJSON" in err)response = err.responseJSON;
			else response = { error: { "Server Error" : err.status } };
			if("db" in response.error && response.error.db=="SQLITE_CONSTRAINT: UNIQUE constraint failed: user.user"){
				response.error.db="user already taken";
			}
			// showErrors("#ui_register",response);
			/** console.log(err.status); console.log(JSON.stringify(err.responseJSON)); **/
		});
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})	
	}


  render() {
    return (
		
			<div className={styles.ui_top}>
				<h2>Register</h2>
				<div className={styles.form_top}>
					<div className={styles.form_row} name="user">
						<label>user</label><input onChange={this.handleChange} type="text" name="user" placeholder="User Name" />
					</div>
					<div className={styles.form_row} name="password">
						<label>password</label><input onChange={this.handleChange} type="password" name="password" placeholder="Password" />
					</div>
					<div className={styles.form_row} name="confirmpassword">
						<label>confirm</label><input  onChange={this.handleChange} type="password" name="confirmpassword" placeholder="Confirm Password" />
					</div>
					{/* <div className="form-row">
						<label>skill</label>
						<input type="radio" data-name="skill" name="skill" value="beginner"   checked={true}>beginner</input>
						<input type="radio" data-name="skill" name="skill" value="intermediate"   checked={false}>intermediate</input>
						<input type="radio" data-name="skill" name="skill" value="advanced"  checked={false}>advanced</input>
					</div> */}
					<div className={styles.form_row} name="birthday">
						<label>Birthday</label>
						<input onChange={this.handleChange} type="number" min="1900" max="2100" name="year" placeholder="year" />
						<select onChange={this.handleChange} name="month">
							<option value="Jan">Jan</option>
							<option value="Feb">Feb</option>
							<option value="Mar">Mar</option>
							<option value="Apr">Apr</option>
							<option value="May">May</option>
							<option value="Jun">Jun</option>
							<option value="Jul">Jul</option>
							<option value="Aug">Aug</option>
							<option value="Sep">Sep</option>
							<option value="Oct">Oct</option>
							<option value="Nov">Nov</option>
							<option value="Dec">Dec</option>
						</select>
						<input onChange={this.handleChange} type="number" min="1" max="31" name="day" placeholder="day" />
					</div>
					{/* <div className="form-row" name="plantoplay">
						<label>I plan to play:</label>
						<input type="checkbox" data-name="playmorning" value="yes" >morning</input>
						<input type="checkbox" data-name="playafternoon" value="yes" >afternoon</input>
						<input type="checkbox" data-name="playevening" value="yes" >evening</input>
					</div> */}
					<div className={styles.form_row}>
						<input type="submit" id="registerSubmit" value="Register" onClick={this.api_register.bind(this)} />
					</div>

					{/* <thead>
						 <div className="form-errors" colspan="2"></div> 
					</thead> */}
				
				</div>
			</div>
		
    );
  }
}

export default Registration;