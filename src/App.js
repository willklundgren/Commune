import React, { Fragment } from 'react';
import './App.css';
import NavBar from './Components/NavBar';
import PlaylistTable from './Components/PlaylistTable'
import PlaylistHeader from './Components/PlaylistHeader'
import PlaylistRow from './Components/PlaylistRow'
import Customers from './Components/customers'

function App() {

  return (
    <Fragment>
      <NavBar/>
      <PlaylistTable/>
      <Customers/>
    </Fragment>
  );
}

export default App;
