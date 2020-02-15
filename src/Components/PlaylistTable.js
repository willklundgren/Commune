import React, { Fragment } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import PlaylistHeader from './PlaylistHeader'
import PlaylistRow from './PlaylistRow';
import './PlaylistTable.css';

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
    spotifyApi.setAccessToken(this.props.access_token);
    spotifyApi.getPlaylist(this.props.playlist_id)
      .then(response => this.setState({playlist: response}))
      .then( () => console.log(this.state.playlist))
  }

  render() {

    return (
      <Fragment>

        {this.state.playlist != 'NULL' &&
          <span>
          Playlist: {this.props.playlist_name} 
          </span>
        }
      
        <table className='PlaylistTable'>
                <PlaylistHeader/>

                {this.state.playlist != 'NULL' && this.state.playlist.tracks.items.map(
                  song => <PlaylistRow user = {this.props.display_name} rowSong = {song} />
                  )}

        </table>
      </Fragment>
    );
  }
};

export default PlaylistTable;