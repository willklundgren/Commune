import React from 'react';
import { useLocation } from "react-router-dom";
import './SpotifyLogin.css';

function getAccessToken() {
    console.log(HashChangeEvent.newURL)
}

function usePageViews() {
    let location = useLocation();
    console.log(location);
    return location.pathname;
}

class SpotifyLogin extends React.Component {
    constructor() {
      super();
      this.state = {
      };
    }
  
    render() {
      console.log(this.props.spotify_login_url)
      return (
        <div className = "LoginButton">
            <a href = {this.props.spotify_login_url}>
                Login to Spotify
            </a>
        </div>
      );
    }
  };
  
  export default SpotifyLogin;