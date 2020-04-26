import React, { Fragment } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import PlaylistHeader from './PlaylistHeader'
import PlaylistRow from './PlaylistRow';
import './PlaylistTable.css';
import { Link, Redirect, NavLink } from 'react-router-dom';
import NavBar from './NavBar'
import axios from 'axios';

// import { frontend_dev_config as config } from "../frontend_config.js" // For DEVELOPMENT
import { frontend_prod_config as config } from "../frontend_config.js" // For PRODUCTION

class PlaylistTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: "NULL",
      playlist_comments: "NULL",
      profile: false
    }
    // console.log(props)
  }

  componentDidMount() {
    var tableSessionInfo = this.props.table_data.location.state.tableSessionInfo
    var playlist_id = tableSessionInfo.playlist_id
    var playlist_name = encodeURIComponent(tableSessionInfo.playlist_name)
    var access_token = tableSessionInfo.access_token
    var playlist_comments_url = `${config.database_url}/playlist_comments/${playlist_id}/${playlist_name}`
    var playlist_tracks_url = `/get_all_playlist_tracks/${playlist_id}/${access_token}`
   
    // Call to the Spotify server...
    var SpotifyRequestPromise = axios.get( playlist_tracks_url )
    var DatabaseRequestPromise = axios.get( playlist_comments_url )
    axios.all([SpotifyRequestPromise, DatabaseRequestPromise]).then(axios.spread((...responses) => {
      const spotify_response = responses[0]
      const db_response = responses[1]
      this.setState({
          playlist: spotify_response.data, 
          playlist_comments : db_response.data.playlist_comments // getting an *object* of comments
        })
      console.log(spotify_response.data)  
      })
    )
    
  }

  render() {

    return (
      <Fragment>

        {/* <div className="LandingPageTitle">Betterplay</div> */}
        <NavBar  
          user_display_name = {this.props.table_data.location.state.tableSessionInfo.display_name}
          spotify_login_url = "NULL - at table component"
          authenticated = {true}
          playlist_name = {this.props.table_data.location.state.tableSessionInfo.playlist_name}
        />

        <div>

                <table className='PlaylistTable'> 

                {/* <col className = "TestColumn" ></col>
                <col className = "TestColumn" ></col>
                <col className = "TestColumn" ></col>
                <col className = "TestColumn" ></col> */}

                  {this.state.playlist != 'NULL' && <PlaylistHeader/> }

                  {this.state.playlist != 'NULL' &&
                  this.state.playlist_comments != "NULL" && 
                  this.state.playlist
                  .sort(
                    (song1, song2) => 
                      (song2.added_at > song1.added_at) ? 1 :
                      (song2.added_at < song1.added_at) ? -1 : 0
                  )
                  .map(
                    song => <PlaylistRow
                    playlist_id = {this.props.table_data.location.state.tableSessionInfo.playlist_id} 
                    user = {this.props.table_data.location.state.tableSessionInfo.display_name} 
                    song_title = {song.track.name}
                    artist = {song.track.artists[0].name}
                    date_added = {song.added_at}
                    song_id = {song.track.id}
                    // added_by = {song.added_by.id}
                    song_comments = { typeof(this.state.playlist_comments) === 'undefined' ? undefined : this.state.playlist_comments[`${song.track.id}`] }
                    />
                  )}

                </table>

        </div>

       
      </Fragment>
    );
  }
};

export default PlaylistTable;