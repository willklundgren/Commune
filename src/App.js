import React, { Fragment } from 'react';
import './App.css';
import NavBar from './Components/NavBar';
import PlaylistTable from './Components/PlaylistTable'
import PlaylistHeader from './Components/PlaylistHeader'
import PlaylistRow from './Components/PlaylistRow'
import SpotifyLogin from './Components/SpotifyLogin';
import PlaylistSelector from './Components/PlaylistSelector';
import SpotifyWebApi from 'spotify-web-api-js';

import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  HashRouter,
  Route,
  useParams,
  useLocation,
  Redirect
} from "react-router-dom";
import SessionContainer from './Components/SessionContainer';
import config from "./config.js"
// const config = require('./config');
const { db: { host, port, name } } = config;
console.log({config})

var azure_public_ip = '52.246.250.124',
    spotify_port = 3223, // Static IP from Azure VM
    spotify_login_url = 'http://' + azure_public_ip + ':' + spotify_port + '/login'

// **DO NOT CHANGE BELOW LINE - USED BY SHELL SCRIPT**
var dev = true
// *********************************

if (dev != false) {
  spotify_login_url = 'http://localhost:' + spotify_port + '/login'
}

// console.log(config.get("test.well"))

function App() {
 
  return (
    <Router>
   
        <Switch>

          <Route 
            path="/authenticated" 
            
            render={ routeProps => <SessionContainer sessionInfo={routeProps} /> }
          >
            {/* <Redirect to= {{
              pathname: "/select_playlist",
              state: {access_token: 4}
            }}
            ></Redirect> */}
  
          </Route>

          <Route path="/select_playlist"
          render = { routeProps => console.log(routeProps)  } >
          </Route>

          <Route 
            path="/test"
            render= { routeProps => <span>hi</span>  }
          />

          <Route
            path="/">
            <NavBar spotify_login_url={spotify_login_url} authenticated={false}/>
          </Route>

        </Switch>
     


    </Router>

  );
}

export default App;

















