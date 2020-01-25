import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    HashRouter,
    Route,
    useParams,
    useLocation
  } from "react-router-dom";

// Replace with your app's client ID, redirect URI and desired scopes
const clientID = "0a1b0b9e8bd043b8b1c360413e26b0f3";
const redirectURI = "https://localhost:3000";
const authEndpoint = "https://accounts.spotify.com/authorize/client_id=0a1b0b9e8bd043b8b1c360413e26b0f3&redirect_uri=https://localhost:3000%scope=user%20%read%20%playback%20%state&response_type=token&show_dialog=true";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
];

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
      return (
        <div>
            <a href = "http://localhost:3223/login">
                Login to Spotify
            </a>
        </div>
      );
    }
  };
  
  export default SpotifyLogin;