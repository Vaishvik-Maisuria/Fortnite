import React, { Component } from 'react';
import styles from '../App.css';
import $ from 'jquery'


class Stats extends Component {

  constructor(props) {
    super(props);
    this.state = {
      players: []
    };

    // this.getProfile = this.getProfile.bind(this)
  }
  
  componentDidMount() {
    this.getProfile()
  }

  getProfile() {
   $.ajax({
      method: "GET",
      url: "/api/users/",
    }).done(function (data, text_status, jqXHR) {
      // console.log(text_status);
      // console.log(jqXHR.status);
      this.setState({
        players: data.data
      });
      console.log('log data ',data.data);
      
      /** console.log(JSON.stringify(data)); console.log(text_status); console.log(jqXHR.status); **/
    }.bind(this)).fail(function (err) {
      let response = {};
      if ("responseJSON" in err) response = err.responseJSON;
      else response = { error: { "Server Error": err.status } };

      // f(response, false);
      /** console.log(err.status); console.log(JSON.stringify(err.responseJSON)); **/
    });
  }

  render() {
    
    if (this.state.players == null){
      return <div />
    }

    const playerList = this.state.players.map((item) =>{
      // console.log(item);
      <tr>
        <td>{item.username}</td>
        <td>{ item.wins + '' + item.loses } </td>
      </tr>
    })

    return (
      <div className="row container">
        <div className="card" style={{margin: '2%', paddingBottom:'2%'}} >
            <h1>User Name</h1>

            <div className=" deep-purple darken-3 card-panel" style={{margin: '5%', height:'25%'}}>
              <h2 className="white-text text-darken-3">1/2</h2>
              <text className="white-text">WIN/LOSE Ratio</text>
            </div>

            <h2>Scoreboard</h2>
            <div className="card-panel" style={{margin:'5%'}}>
              <table className="highlight centered responsive-table">
                <thead>
                  <tr>
                      <th>Player Name</th>
                      <th>Ratio</th>
                  </tr>
                </thead>
                <tbody>
                  {playerList}
                </tbody>
              </table>
            </div>
        
        </div>
      </div>
        
    );
    }
}

export default Stats;
