import React from 'react';
import { useLocation } from "react-router-dom";
import './SpotifyLogin.css';
import axios from 'axios';

class SpotifyLogin extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
      this.loginToSpotify = this.loginToSpotify.bind(this);
      this.isAuthenticated = this.isAuthenticated.bind(this);
    }

    loginToSpotify = () => {
      console.log(this.props.spotify_login_url)
      axios.get(this.props.spotify_login_url, {
        headers: {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            // "Upgrade-Insecure-Requests": 1
          }
        }   
      )
      // .then(response => console.log(response))
    }

    isAuthenticated = () => {
      if (!this.props.authenticated) {
        return (
        <div className = "LoginButtonSignedOut">
          <a className = "SpotifyLoginHREF" href = {this.props.spotify_login_url}>Login to Spotify</a>
          {/* <button onClick={this.loginToSpotify}>Login to Spotify</button> */}
          
        </div>
        )
      }
      else {
        return (
          <span className = "LoginButtonSignedIn">
            Signed in as {this.props.user_display_name}
          </span>
        )

      }
    }
  
    render() {
      // console.log("spotify login URL:", this.props.spotify_login_url)
      return (
          this.isAuthenticated()
      );
    }
  };
  
  export default SpotifyLogin;