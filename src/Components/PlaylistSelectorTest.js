import React, { Fragment } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import PlaylistHeader from './PlaylistHeader'
import PlaylistRow from './PlaylistRow';
import './PlaylistTable.css';
import PlaylistTable from './PlaylistTable';
import axios from 'axios';
import { useLocation, Redirect, Route, Switch } from "react-router-dom"
import './PlaylistSelector.css';

// NOTE: this class contains the SessionInfo object as a prop, which in turn contains: user ID, display name, access token, refresh token

class PlaylistSelectorTest extends React.Component {
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
    console.log("in getPlaylistData")
    var id = this.props.user_data.location.state.userSessionInfo.user_id;
    var limit = 50;
    var url_string = `https://api.spotify.com/v1/users/${id}/playlists?limit=${limit}`
    var get_all_playlists_url = `http://localhost:3223/get_all_playlists/${id}/${token}`
    
    axios.get( get_all_playlists_url   )
    .then( response =>
      {
        this.setState({
          playlists_available: response.data
        })
        // console.log(response)
      }
    )

    // axios.get( url_string, {
    //   headers: {
    //     "Authorization": "Bearer " + token
    //   }
    // } )
    // .then(response => {
    //   console.log(response)
    //   this.setState({
    //     playlists_available: response.data.items
    //       .filter(item => item.collaborative == true)
    //       .map(playlist => [playlist.name, playlist.id]),
    //     spotify_playlist_index: response.data.offset + limit
    //     },
    //     () => console.log("PlaylistSelector's playlist_available value is:", this.state.playlists_available))
    //   // console.log(response.data.offset + limit)
    //   }
    // )
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
    // console.log(this.state.value)
   }

   // After a playlist selection has been made, render a PlaylistTable.js 
   // with the playlist ID as a prop
   handlePlaylistSelection = (event) => {
    // console.log('ID of selected playlist: ' + this.state.value);
    event.preventDefault();
    if (this.state.value != "No playlist selected.") {
        this.setState({playlistSelected: true})
    }
  }

  render() {

    return (

      <div className="PlaylistSelector">
        
        <div className="LandingPageTitle">Betterplay</div>

        {this.state.playlistSelected == false && 
        <div className="SelectionElements">
            <form onSubmit={this.handlePlaylistSelection}>
              <label>
                <span>Select a playlist...</span>
                <br></br>
                <select className="SelectionDropdown" onChange={this.handleChange}>
                  <option selected value = "No playlist selected.">(Select a playlist)</option>
                  {this.showPlaylistOptions(this.state.playlists_available)}
                </select>
              </label>
              <input className="PlaylistSubmissionButton" type="submit" value="Submit" />
          </form>
          {/* <button onClick={this.getMorePlaylists}>Load more playlists</button> */}
        </div>
        }

        {this.state.playlistSelected == true &&
          <Redirect push to={{ 
            pathname:"/playlist_selected", 
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

export default PlaylistSelectorTest;