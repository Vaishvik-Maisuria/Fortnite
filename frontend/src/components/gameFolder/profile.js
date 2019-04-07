import React, { Component } from 'react';
import styles from '../App.css';
import styles2 from '../loginAndRegistration/loginAndRegistration.css'
import {checkbox} from '../CheckBox/checkboxes'

import Checkbox from '../CheckBox/Checkbox';

import $ from 'jquery'


class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: "",
      password: "",
      confirmpassword: "",
      skill: "beginner",
      year: "",
      month: "",
      day: "",
      playingTime: checkbox,
			totalPlaying: 0,
      playafternoon: false,
			playevening: false,
			playmorning: false,
			errors:[],
			success: ''
    };
  }

  getProfile() {
    console.log('user', this.props.user);
    

    $.ajax({
      method: "GET",
      url: "/api/user/" + this.props.user,
      dataType: "json",
      data: { "password": this.props.password } // send URL encoded credentials
    }).done(function (data, text_status, jqXHR) {
      // console.log(text_status);
      // console.log(jqXHR.status);
      console.log('Data',  data.data);
      
      var checks = this.state.playingTime
			var total = 0
      checks.playafternoon.checked =  data.data.playafternoon == 1? true : false
      checks.playmorning.checked =  data.data.playmorning == 1? true : false
      checks.playevening.checked =  data.data.playevening == 1? true : false
			
			total = data.data.playafternoon + data.data.playmorning + data.data.playevening

      console.log('This is checks',checks);
      
      this.setState({
        user: data.data.user,
        password: data.data.password,
        confirmpassword: data.data.password,
        skill: data.data.skill,
        year: data.data.year,
        month: data.data.month,
        day: data.data.day,
        playingTime: checks,
        playmorning: data.data.playmorning,
        playafternoon: data.data.playafternoon,
				playevening: data.data.playevening,
				totalPlaying: total
      });


      /** console.log(JSON.stringify(data)); console.log(text_status); console.log(jqXHR.status); **/
    }.bind(this)).fail(function (err) {
      let response = {};
      if ("responseJSON" in err) response = err.responseJSON;
      else response = { error: { "Server Error": err.status } };

      // f(response, false);
      /** console.log(err.status); console.log(JSON.stringify(err.responseJSON)); **/
    });
  }


  api_register() {
		let data = this.state;
		console.log('Data', this.state);
		// d.playmorning, d.playafternoon, d.playevening
		const validation = this.typeValidation()
		if (!validation) return
		
		$.ajax({
			method: "PUT",
			url: "/api/user/" + data.user,
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify(data)
		}).done(function (data, text_status, jqXHR) {
			console.log(text_status);
			console.log(jqXHR.status);
			this.setState({
				success: 'Updated Successfully'
			})
			// this.props.showlogin();
			// showUI("#ui_login");
			/** console.log(JSON.stringify(data)); console.log(text_status); console.log(jqXHR.status); **/
		}.bind(this)).fail(function (err) {
			let response = {};
			if ("responseJSON" in err) response = err.responseJSON;
			else response = { error: { "Server Error": err.status } };
			if ("db" in response.error && response.error.db == "SQLITE_CONSTRAINT: UNIQUE constraint failed: user.user") {
				response.error.db = "user already taken";
			}
			var errors = ['userTaken']
			this.setState({
				errors: errors
			})
			console.log(response.error.db);
			
			// showErrors("#ui_register",response);
			/** console.log(err.status); console.log(JSON.stringify(err.responseJSON)); **/
		}.bind(this));
	}

  componentDidMount() {
    this.getProfile(); 
  }

  handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitted');
    
		this.api_register()
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
		console.log(e.target.value);
		
  }
  
  handleChangecheck = (e) => {
		const item = e.target.name;
		const isChecked = e.target.checked;
		
		const playTime = this.state.playingTime
		console.log(playTime);
		const strup = item.replace('/n', '')
		console.log(strup);
		
		playTime[strup].checked = e.target.checked
		if (e.target.checked){
			this.state.totalPlaying += 1
		}else {
			this.state.totalPlaying -= 1

		}
		
		this.setState({
			playingTime: playTime
		})

	}
	
	typeValidation =() => {
		var errors = []
		const keys = Object.keys(this.state)
		if (this.state.user === '') errors.push('user')
		if (this.state.password === '') errors.push('password')
		if (this.state.confirmpassword === '') errors.push('confirmpassword')
		if (this.state.password !== this.state.confirmpassword) errors.push('passwordMisMatch')
		if (this.state.year  === '') errors.push('year')
		if (this.state.day === '') errors.push('day')
		if (this.state.month === '') errors.push('month')
		if (this.state.skill === '') errors.push('skill')
		if (this.state.totalPlaying === 0) errors.push('playTime')
		
		
		// if (this.state.checkedItems.size === 0) errors.push('items')

		this.setState({
			errors: errors
		})
		return errors.length == 0

	}



  render() {

    const { playingTime, errors } = this.state
    
    return (

			<div className="card">
				<h2>Profile</h2>
				<div className="card" style={{padding: '2%',  margin: '2%'}}>
          <form onSubmit={this.handleSubmit}>

            <div name="user">
              <label 
              className={(errors.includes('user') || errors.includes('userTaken'))? 'red-text darken-1' : ''} >
              User {errors.includes('userTaken')? '(Username Taken, Pick a different one)': ''}</label>
							<input 
							disabled={true}
              value={this.state.user}
              onChange={this.handleChange} 
              type="text" name="user" 
              placeholder="User Name" />
            </div>

            <div  name="password">
							<label className={errors.includes('password')? 'red-text darken-1' : ''}>Password</label>
							<input 
							disabled={true}
              value={this.state.password}
              onChange={this.handleChange} type="password" name="password" placeholder="Password" />
						</div>

            <div name="confirmpassword">
							<label
							 className=
							{(errors.includes('confirmpassword') ||errors.includes('passwordMisMatch') )? 'red-text darken-1' : ''}
							>
							Confirm{errors.includes('passwordMisMatch')? '(Password doesnt match)' : ''}
							</label>
							<input
              value={this.state.confirmpassword}
							onChange={this.handleChange} 
							type="password" 
							name="confirmpassword" 
							placeholder= "Confirm Password" />
						</div>

            <div className="">
							
							<label 
							className={errors.includes('skill')? 'red-text darken-1' : ''}
							style={{fontSize: '25sp', fontWeight: 'bold'}}>Skill</label>
							<div className="">
								<p>
									<label>
										<input 
										onChange={this.handleChange}
										name="skill" 
										type="radio" 
										value="beginner"
										checked={this.state.skill == 'beginner'} />
										<span>Beginner</span>
									</label>
								</p>
							</div>
							<div className="">
								<p>
									<label>
										<input 
										onChange={this.handleChange}
										name="skill" 
										type="radio"
										value="intermediate"
										checked={this.state.skill == 'intermediate'} />
										<span>Intermediate</span>
									</label>
								</p>
							</div>
							<div className="">
								<p>
									<label>
										<input 
										onChange={this.handleChange}
										name="skill" 
										type="radio" 
										value="advanced"
										checked={this.state.skill == 'advanced'} />
										<span>Advance</span>
									</label>
								</p>
							</div>
							
						</div>

            <div className="row">
							<div className="col s4">
								<label
								className={errors.includes('month')? 'red-text darken-1' : ''}
								>Month</label>
								<select value={this.state.month} name="month" onChange={this.handleChange} className="browser-default">
									<option value="" disabled selected>Month</option>
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
							</div>
							
							<div className="col s4">
								<label
								className={errors.includes('day')? 'red-text darken-1' : ''}
								>Day</label>
                <input 
                value={this.state.day}
                onChange={this.handleChange} type="number" min="1" max="31" name="day" placeholder="day" />
							</div>

							<div className="col s4">
								<label
								className={errors.includes('year')? 'red-text darken-1' : ''}
								>Year</label>
                <input 
                value={this.state.year}
								onChange={this.handleChange} 
								type="number" min="1900" max="2100" name="year" placeholder="year" />
							</div>
						</div>

            <div className="row">
							<label
							className={errors.includes('playTime')? 'red-text darken-1' : ''}
							>I plan to play:</label>
							{
								Object.keys(playingTime).map(item => {
                  // console.log(item)
                  return (
                    <Checkbox 
                      name={playingTime[item].name} 
                      checked={playingTime[item].checked}
                      onChange={this.handleChangecheck} 
                    />
                  )
                })
							}
						</div>

            <div >
							<input 
							className="waves-effect blue btn-small"
							type="submit" 
							id="registerSubmit" 
							value="Update" 
							 />
						</div>

          </form>
				</div>
			</div>
    );
  }
}

export default Profile;
