import React from 'react';
import './NavBar.css'
import SpotifyLogin from "./SpotifyLogin.js"
import { useLocation } from "react-router-dom";

function NavBar(props) {
  // console.log(this.props.location)
  let location = useLocation();
  console.log(location)
  console.log("react router location:" )
  let pathname = location.pathname;
  return (
    <div className="NavBar">
        <div className="Title">Betterplay</div>
        {/* <div className="LoginSpotify">Spotify Login Here</div> */}
        <SpotifyLogin user_display_name={props.user_display_name} spotify_login_url = {props.spotify_login_url} authenticated = {props.authenticated}/>
    </div>
  );
}

export default NavBar;