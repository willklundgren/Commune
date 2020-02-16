import React from 'react';
import './NavBar.css'
import SpotifyLogin from "./SpotifyLogin.js"

function NavBar(props) {
  return (
    <div className="NavBar">
        <div className="Title">Betterplay</div>
        {/* <div className="LoginSpotify">Spotify Login Here</div> */}
        <SpotifyLogin spotify_login_url = {props.spotify_login_url}/>
    </div>
  );
}

export default NavBar;