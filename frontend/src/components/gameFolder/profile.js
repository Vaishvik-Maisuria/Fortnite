import React, { Component } from 'react';
import styles from '../App.css';
import styles2 from '../loginAndRegistration/loginAndRegistration.css'
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
      playmorning: "yes",
      playafternoon: "",
      playevening: ""
    };
  }

  getProfile() {

    $.ajax({
      method: "GET",
      url: "/api/user/" + this.props.user,
      dataType: "json",
      data: { "password": this.props.password } // send URL encoded credentials
    }).done(function (data, text_status, jqXHR) {
      // console.log(text_status);
      // console.log(jqXHR.status);
      console.log(data.user);
      console.log(data.password);
      this.setState({
        user: data.user,
        password: data.password,
        confirmpassword: data.confirmpassword,
        skill: data.skill,
        year: data.year,
        month: data.month,
        day: data.day,
        playmorning: data.playmorning,
        playafternoon: data.playafternoon,
        playevening: data.playevening
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


  api_profile() {
    let data = this.state;
    $.ajax({
      method: "PUT",
      url: "/api/user/" + data.user,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      data: JSON.stringify(data)
    }).done(function (data, text_status, jqXHR) {
      console.log(text_status);
      console.log(jqXHR.status);
      f(data, true);

      /** console.log(JSON.stringify(data)); console.log(text_status); console.log(jqXHR.status); **/
    }).fail(function (err) {
      let response = {};
      if ("responseJSON" in err) response = err.responseJSON;
      else response = { error: { "Server Error": err.status } };
      f(response, false);
      /** console.log(err.status); console.log(JSON.stringify(err.responseJSON)); **/
    });
  }

  componentDidMount() {
    this.getProfile();

    // putDataIntoProfileForm
    // document.getElementById('user').className = "";
    // document.getElementById('homeHyperlink').className = "";
    // document.getElementById('profileHyperlink').className = "active";

  }

  render() {
    
    console.log(this.state.user);
    return (
      <div className={styles.box_container}>
        <div className={styles.box_controller}>
          <div className={styles2.ui_top}>
            <h2>Profile Page</h2>
            <div className={styles2.form_top}>
              <div className={styles.form_row} name="user">
                <label>user</label><input onChange={this.handleChange} type="text" id="user" data-name="user" placeholder={this.state.user} />
              </div>
              <div className={styles2.form_row} name="password">
                <label>password</label><input onChange={this.handleChange} type="password" id="password" data-name="password" placeholder={this.state.password} />
              </div>
              <div className={styles2.form_row} name="confirmpassword">
                <label>confirm</label><input onChange={this.handleChange} type="password" id="confirmpassword" data-name="confirmpassword" placeholder={this.state.confirmpassword} />
              </div>
              {/* <div className="form-row">
						<label>skill</label>
						<input type="radio" data-name="skill" name="skill" value="beginner" checked={true}>beginner</input>
						<input type="radio" data-name="skill" name="skill" value="intermediate" checked={false}>intermediate</input>
						<input type="radio" data-name="skill" name="skill" value="advanced" checked={false}>advanced</input>
					</div> */}
              <div className={styles2.form_row} name="birthday">
                <label>Birthday</label>
                <input onChange={this.handleChange} type="number" min="1900" max="2100" id="year" data-name="year" placeholder={this.state.year} />
                <select onChange={this.handleChange} id="month" data-name="month">
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
                <input onChange={this.handleChange} type="number" min="1" max="31" id="day" data-name="day" placeholder={this.state.day} />
              </div>
              {/* <div className="form-row" name="plantoplay">
						<label>I plan to play:</label>
						<input type="checkbox" data-name="playmorning" value="yes" >morning</input>
						<input type="checkbox" data-name="playafternoon" value="yes" >afternoon</input>
						<input type="checkbox" data-name="playevening" value="yes" >evening</input>
					</div> */}
              <div className={styles2.form_row}>
                <input type="submit" id="updateProfileSubmit" value="Update" onClick={this.api_profile.bind(this)} onclick="gui_profile();" />
              </div>
              {/* <thead>
            <div class="form-errors" colspan="2"></div>
          </thead> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
