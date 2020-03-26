import React, { Fragment } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import PlaylistHeader from './PlaylistHeader'
import PlaylistRow from './PlaylistRow';
import './PlaylistTable.css';
import { Link, Redirect, NavLink } from 'react-router-dom';
import axios from 'axios';

const spotifyApi = new SpotifyWebApi();

class PlaylistTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: "NULL",
      profile: false
    };
  }

  componentDidMount() {

    var playlist_id = this.props.playlist_id
    var access_token = this.props.access_token
    var url_string = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`
    var accumulated_playlist = []
    var more_tracks = true

    var playlist_tracks_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`
    var stuff = `https://api.spotify.com/v1/me`
   

    axios.get( `http://52.246.250.124:3223/get_all_playlist_tracks/${playlist_id}/${access_token}`)
    .then(
        response => {
          console.log(response)
          this.setState({playlist: response})
        }
      ) 
  }

  redirect() {
    return <Redirect to="/"authenticated></Redirect>
  }

  render() {

    return (
      <Fragment>
        <div>

          {/* <Link to="/">Sign out</Link> */}
          

          {this.state.playlist != 'NULL' &&
              <div className="PlaylistName">
              {this.props.playlist_name} 
              </div>
          }
      
                <table className='PlaylistTable'> 

                  {this.state.playlist != 'NULL' && <PlaylistHeader/> }

                  {this.state.playlist != 'NULL' &&
        
                  this.state.playlist.data
                  .sort(
                    (song1, song2) => !( song2.added_at - song1.added_at )
                  )
                  .map(
                    song => <PlaylistRow user = {this.props.display_name} rowSong = {song} />
                    )}

                </table>

        </div>

       
      </Fragment>
    );
  }
};

export default PlaylistTable;