import React, { Fragment } from 'react';
import './App.css';
import NavBar from './Components/NavBar';
import PlaylistTable from './Components/PlaylistTable'
import PlaylistHeader from './Components/PlaylistHeader'
import PlaylistRow from './Components/PlaylistRow'
import SpotifyLogin from './Components/SpotifyLogin';
import PlaylistSelector from './Components/PlaylistSelector';


import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  HashRouter,
  Route,
  useParams,
  useLocation
} from "react-router-dom";


var azure_public_ip = '52.246.250.124',
    spotify_port = 3223, // Static IP from Azure VM
    spotify_login_url = 'http://' + azure_public_ip + ':' + spotify_port + '/login'

// **DO NOT CHANGE BELOW LINE - USED BY SHELL SCRIPT**
var dev = true
// *********************************

if (dev != false) {
  spotify_login_url = 'http://localhost:' + spotify_port + '/login'
}

function App() {

  let location = useLocation();
  let pathname = location.pathname;
  
  return (
    <Fragment>
      <SpotifyLogin spotify_login_url = {spotify_login_url}/>
      <NavBar/>
      <PlaylistSelector url = {location.pathname}/>
      {/* <PlaylistTable url = {location.pathname}/> */}
    </Fragment>
  );
}

export default App;







