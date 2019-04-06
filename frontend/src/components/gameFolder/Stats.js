import React, { Component } from 'react';
import styles from '../App.css';
import $ from 'jquery'
import { throws } from 'assert';


class Stats extends Component {

  constructor(props) {
    super(props);
    this.state = {
      players: null,
      check: false,
      player: null
    };

  }
  
  
  componentDidMount() {
      this.getProfile()
      console.log('after ajax call');
      
  }

  getProfile = () => {
   $.ajax({
      method: "GET",
      url: "/api/users/",
    }).done(function (data, text_status, jqXHR) {
      
      var userProfile = null
      for (var i = 0; i < data.data.length; i ++){
        if (data.data[i].username == this.props.user){
          userProfile = data.data[i]
          break
        }
      }

      this.setState({
        players: data.data,
        player: userProfile
      })

 
      console.log('log data ',data.data);
      /** console.log(JSON.stringify(data)); console.log(text_status); console.log(jqXHR.status); **/
    }.bind(this)).fail(function (err) {
      let response = {};
      if ("responseJSON" in err) response = err.responseJSON;
      else response = { error: { "Server Error": err.status } };
      return 'err'
      // f(response, false);
      /** console.log(err.status); console.log(JSON.stringify(err.responseJSON)); **/
    });
  }

  render() {
    
    return (
      <div className="row container">
        <div className="card" style={{margin: '2%', paddingBottom:'2%'}} >
            <h1>{this.props.user}</h1>

            <div className=" deep-purple darken-3 card-panel" style={{margin: '5%', height:'25%'}}>
              {this.state.player!=null? 
                <h2 className="white-text text-darken-3">{this.state.player.wins + '/' + this.state.player.loses}</h2>
                :
                null
              }
             
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
                    {this.state.players != null?
                      this.state.players.map((item, index) => {
                        console.log('idnex:', index);
                        return(
                          <tr>
                            <td>{item.username}</td>
                            <td>{item.wins + '/' + item.loses}</td>
                          </tr>
                        )
                      })
                      :
                      null
                    }
                </tbody>
              </table>
            </div>
        
        </div>
      </div>
        
    );
    }
}

export default Stats;
