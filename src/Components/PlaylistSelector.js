import React, { Fragment } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import PlaylistHeader from './PlaylistHeader'
import PlaylistRow from './PlaylistRow';
import './PlaylistTable.css';
import PlaylistTable from './PlaylistTable';
import axios from 'axios';
import { useLocation, Redirect, Route, Switch } from "react-router-dom"
import './PlaylistSelector.css';

// import { frontend_dev_config as config } from "../frontend_config.js" // For DEVELOPMENT
import { frontend_prod_config as config } from "../frontend_config.js" // For PRODUCTION

class PlaylistSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: "NULL",
      playlists_available: "NULL",
      hasTokens: false,
      value: 'No playlist selected.',
      playlistSelected: false,
      spotify_playlist_index: 0
    }
  }
  
  componentDidMount() {
    // Get a list of collaborative playlists
    this.getPlaylistData(this.props.user_data.location.state.userSessionInfo.access_token)
  }

  getPlaylistData = ( token ) => {
    //console.log("in getPlaylistData")
    var id = this.props.user_data.location.state.userSessionInfo.user_id;
    var limit = 50;
    var url_string = `https://api.spotify.com/v1/users/${id}/playlists?limit=${limit}`
    var get_all_playlists_url = `/get_all_playlists/${id}/${token}`
    
    axios.get( get_all_playlists_url   )
    .then( response =>
      {
        this.setState({
          playlists_available: response.data
        })
        // console.log(response)
      }
    )
  }

   submitPlaylistSelection = (event, playlist_id) => {
     event.preventDefault()
     console.log("chosen playlist id: ", playlist_id)
   }

   showPlaylistOptions = (playlists_array) => {
    // console.log("in showPlaylistOptions")
    if (playlists_array != 'NULL') {
        return playlists_array.map(playlist => <option value={playlist}>{playlist[0]}</option> )
    }
   }

   handleChange = (event) => {
    event.preventDefault();
    this.setState({value: event.target.value});
   }

   // After a playlist selection has been made, render a PlaylistTable.js 
   // with the playlist ID as a prop
   handlePlaylistSelection = (event) => {
    event.preventDefault();
    if (this.state.value != "No playlist selected.") {
        this.setState({playlistSelected: true})
    }
  }

  render() {

    return (

      <div className="PlaylistSelector">

        <div className="SelectionPageTitle">Betterplay</div>

        {/* <div className="UserSignedIn">Signed in as {this.props.user_data.location.state.userSessionInfo.user_display_name }</div> */}

        {this.state.playlistSelected == false && 
        <div className="SelectionElements">
          <span>Select a playlist...</span>
            <form onSubmit={this.handlePlaylistSelection}>
              <label>
                <select className="SelectionDropdown" onChange={this.handleChange}>
                  <option selected value = "No playlist selected.">(Select a playlist)</option>
                  {this.showPlaylistOptions(this.state.playlists_available)}
                </select>
              </label>
              <input className="PlaylistSubmissionButton" type="submit" value="Submit" />
          </form>
        </div>
        }

        {this.state.playlistSelected == true &&
          <Redirect push to={{ 
            pathname: `/playlist/${this.state.value.slice( 0, this.state.value.lastIndexOf(","))}`, 
            state: { tableSessionInfo : {
              playlist_id : this.state.value.slice( this.state.value.lastIndexOf(",") + 1) ,
              playlist_name : this.state.value.slice( 0, this.state.value.lastIndexOf(",")) ,
              access_token : this.props.user_data.location.state.userSessionInfo.access_token,
              refresh_token : this.props.user_data.location.state.userSessionInfo.refresh_token,
              user_id : this.props.user_data.location.state.userSessionInfo.user_id,
              display_name : this.props.user_data.location.state.userSessionInfo.user_display_name
            } }
          }}  /> 
        }
      
      </div>
    );
  }
};

export default PlaylistSelector;