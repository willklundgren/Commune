import React from 'react';
import './LandingPage.css'
import SpotifyLogin from "./SpotifyLogin.js"
import { useLocation } from "react-router-dom";

function LandingPage(props) {
  // console.log(this.props.location)
  let location = useLocation();
  console.log(location)
  console.log("react router location:" )
  let pathname = location.pathname;
  return (
    <div className="LandingPage">
          <div className="LandingPageTitle">Betterplay</div>
          <div className="LandingPageDescription">
            Comment on your collaborative Spotify playlists. Get started in seconds.
          </div>
           <SpotifyLogin 
           user_display_name={props.user_display_name}
           spotify_login_url = {props.spotify_login_url} 
           authenticated = {props.authenticated}
           />
    </div>
  );
}

export default LandingPage;