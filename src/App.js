import React, { Fragment } from 'react';
import './App.css';
import NavBar from './Components/NavBar';
import PlaylistTable from './Components/PlaylistTable'
import PlaylistHeader from './Components/PlaylistHeader'
import PlaylistRow from './Components/PlaylistRow'
import SpotifyLogin from './Components/SpotifyLogin';

import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Switch,
  HashRouter,
  Route,
  useParams,
  useLocation
} from "react-router-dom";

function App() {

  let location = useLocation();
  let pathname = location.pathname;
  
  return (
    <Fragment>
      <SpotifyLogin/>
      <NavBar/>
      <PlaylistTable url = {location.pathname}/>
    </Fragment>
  );
}

export default App;
