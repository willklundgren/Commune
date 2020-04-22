import React, { Fragment } from 'react';
import './App.css';
import NavBar from './Components/NavBar';
import PlaylistTable from './Components/PlaylistTable'
import PlaylistHeader from './Components/PlaylistHeader'
import PlaylistRow from './Components/PlaylistRow'
import SpotifyLogin from './Components/SpotifyLogin';
import PlaylistSelector from './Components/PlaylistSelector';
import DatabaseTest from './Components/DatabaseTest';
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route, useLocation, HashRouter, useRouteMatch } from "react-router-dom";
import SessionContainer from './Components/SessionContainer';
import LandingPage from './Components/LandingPage';

// import { frontend_dev_config as config } from "./frontend_config.js" // For DEVELOPMENT
import { frontend_prod_config as config } from "./frontend_config.js" // For PRODUCTION
console.log(config)

function App(props) {

  return (
    <div>
   
        <Switch>

          <Route 
            path="/authenticated"
            //  render={ routeProps => <span>Hello</span> }
            render={ routeProps => <SessionContainer sessionInfo={routeProps} /> }
          > 
          </Route>
          
          <Route 
            path="/select_playlist"
            render={ routeProps => <PlaylistSelector user_data={routeProps} /> }
          >
          </Route>

          
          <Route 
            path="/playlist"
            render={ routeProps => <PlaylistTable table_data={routeProps} /> }
          >
          </Route>

          <Route 
            path="/testRoute" 
            render = { routeProps => <DatabaseTest routeProps = {routeProps} glue="glue" />   }
          >
          </Route>        

          <Route path="/">
            <LandingPage spotify_login_url={'login'} authenticated={false} />
          </Route>

        </Switch>
     
    </div>
  )
}

export default App;










