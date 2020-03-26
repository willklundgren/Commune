import React,{ Fragment } from 'react';
import { useLocation } from "react-router-dom";
import './SpotifyLogin.css';
import axios from 'axios';
import NavBar from './NavBar';
import PlaylistSelector from "./PlaylistSelector"

function getAccessToken ( url ) {
    if (url == "/") {
      return ["ACCESS", "REFRESH", false];
    }
    else {
      url = url.split("=");
      console.log(url[1].split("&")[0])

      // var access_token = url[1].slice(0,162); old method
      var access_token = url[1].split("&")[0];
      var refresh_token = url[2];
      return [access_token, refresh_token, true];
    }
  }

class SessionContainer extends React.Component {
    constructor(props) {
      super(props); // contains tokens and user info
      this.state = {
        hasInfo: false,
        access_token: "NULL",
        refresh_token: "NULL",
        user_id: "NULL",
        user_display_name: "NULL"
      };
    }

    componentDidMount() {
      console.log("session info is:", this.props.sessionInfo)
        var access_token, refresh_token, gotTokens, url_string;

        // Extract the access and refresh tokens from the pathname in sessionInfo prop
        [access_token, refresh_token, gotTokens] = getAccessToken(this.props.sessionInfo.location.pathname)
        console.log("access token is:", access_token)


        // Make a request to get user info using axios
        url_string = "https://api.spotify.com/v1/me"
        axios.get( url_string, {
            headers: {
              "Authorization": "Bearer " + access_token
            }
          }).then( profile =>
            // console.log(profile)
              this.setState( {
                  hasInfo: true,
                  access_token: access_token,
                  refresh_token: refresh_token,
                  user_id: profile.data.id,
                  user_display_name: profile.data.display_name
              }
            )
          )
    }
  
    render() {
      
      return (
        
        <Fragment>
            {this.state.hasInfo == true &&
            <div>

                <NavBar 
                authenticated={true} 
                user_display_name={this.state.user_display_name} 
                />

                <PlaylistSelector
                access_token = {this.state.access_token}
                refresh_token = {this.state.refresh_token} 
                user_id={this.state.user_id} 
                user_display_name={this.state.user_display_name}
                /> 

            </div>
        }
        </Fragment>   
        
      );
    }
  };
  
  export default SessionContainer;