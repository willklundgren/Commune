import React, { Fragment } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import PlaylistHeader from './PlaylistHeader'
import PlaylistRow from './PlaylistRow';
import './PlaylistTable.css';
import PlaylistTable from './PlaylistTable';
import axios from 'axios';

const spotifyApi = new SpotifyWebApi();

// Parse URL string for access and refresh tokens
// Return array of form [accessToken, refreshToken]
function getAccessToken ( url ) {
  if (url == "/") {
    return ["ACCESS", "REFRESH", false];
  }
  else {
    url = url.split("=");
    var access_token = url[1].slice(0,162);
    var refresh_token = url[2];
    return [access_token, refresh_token, true];
  }
}

class PlaylistSelector extends React.Component {
  constructor(props) {
    super(props);
    var propsObject;
    this.state = {
      playlist: "NULL",
      access_token: "",
      refresh_token: "",
      playlists_available: "NULL",
      hasTokens: false,
      spotify_id: false,
      value: 'No playlist selected.',
      playlistSelected: false,
      user_display_name: "NULL",
      spotify_playlist_index: 0
    };
    var limit = 50;
    this.getMorePlaylists = this.getMorePlaylists.bind(this);

  }
  

  componentDidMount() {
    console.log("in PlaylistSelector's componentDidMount...")
    

    var tokens = getAccessToken(this.props.url)
   // console.log(tokens)
    
    spotifyApi.setAccessToken(tokens[0]);
    // .then( response => this.setState({profile: response}) )
    console.log(this.state.spotify_id)

    this.setState( 
        {
        access_token : tokens[0],
        refresh_token : tokens[1],
        hasTokens : tokens[2]
        }
    );

    // Get the user's available playlists and load them into state
    this.getPlaylistData(tokens[0])
  }
  

   getPlaylistData = (token) => {
      console.log("in getPlaylistData")
      var id;
      var limit = 50;
      spotifyApi.getMe()
      .then( response => { 
        this.setState({
        user_display_name: response.display_name,
        spotify_id: response.id
      })
       id = response.id
       //console.log(id)
        }
      )
      .then( () => {
        var url_string = `https://api.spotify.com/v1/users/${id}/playlists?limit=${limit}`

        axios.get( url_string, {
          headers: {
            "Authorization": "Bearer " + token
          }
        } )
        .then(response => {
          console.log(response)
          this.setState({
            playlists_available: response.data.items
              .filter(item => item.collaborative == true)
              .map(playlist => [playlist.name, playlist.id]),
            spotify_playlist_index: response.data.offset + limit
            });
          console.log(response.data.offset + limit)
          }
        )
      } )
      
      




      // spotifyApi.getUserPlaylists()
      // // .then(response => console.log(response))
      // .then( response => this.setState({playlists_available: response.items
      //   .filter(item => item.collaborative == true)
      //   .map(playlist => [playlist.name, playlist.id])
      // }));

      // console.log(token)

      
      console.log(this.state.playlists_available);
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

  getMorePlaylists = () => {
    console.log("current playlist index is ", this.state.spotify_playlist_index)
    console.log(this.state.access_token)
    var offset = this.state.spotify_playlist_index
    var id = this.state.spotify_id
    var limit = 50
    var url_string = `https://api.spotify.com/v1/users/${id}/playlists?limit=${limit}&offset=${offset}`
    axios.get( url_string, {
          headers: {
            "Authorization": "Bearer " + this.state.access_token
          }
        } )
        .then(response => {
          console.log(response)
          this.setState({
            playlists_available: response.data.items
              .filter(item => item.collaborative == true)
              .map(playlist => [playlist.name, playlist.id]),
            spotify_playlist_index: response.data.offset + limit
            });
          console.log(response.data.offset + limit)
          }
        )
  }

  render() {

    return (
      <Fragment>

      {this.state.playlistSelected == false && 
      <form onSubmit={this.handlePlaylistSelection}>
        <label>
          Select a playlist...
          <br></br>
          <select onChange={this.handleChange}>
            <option selected value = "No playlist selected.">(Select an option)</option>
            {this.showPlaylistOptions(this.state.playlists_available)}
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
      }

      <button onClick={this.getMorePlaylists}>Load more playlists</button>

      {this.state.playlistSelected == true &&
       <PlaylistTable 
            playlist_id = {this.state.value.slice( this.state.value.lastIndexOf(",") + 1) }
            playlist_name = {this.state.value.slice( 0, this.state.value.lastIndexOf(",")) }
            access_token = {this.state.access_token}
            refresh_token = {this.state.refresh_token}
            display_name = {this.state.user_display_name}
      />}
      
      </Fragment>
    );
  }
};

export default PlaylistSelector;