import React, { Fragment } from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import PlaylistHeader from './PlaylistHeader'
import PlaylistRow from './PlaylistRow';
import './PlaylistTable.css';

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

class PlaylistTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: "NULL",
      access_token: "",
      refresh_token: "",
      hasTokens: false,
      profile: false
    };

  }

  componentDidMount() {
    var tokens = getAccessToken(this.props.url)

    spotifyApi.setAccessToken(tokens[0]);

    spotifyApi.getMe()
    .then( response => this.setState({profile: response}) )

    this.setState( 
      {
      access_token : tokens[0],
      refresh_token : tokens[1],
      hasTokens : tokens[2]
      }
    );
  }

  getPlaylistData = () => {
    if (this.state.hasTokens == true) {
      // get Beet Chamber playlist
      spotifyApi.getPlaylist('5CtBwfw7lpoOpDavXjchp0')
      .then( response => this.setState({playlist: response}));
      }
      console.log(this.state.playlist);
   }

  render() {

    var data_button;
    if (this.state.hasTokens) {
      data_button = <button onClick={this.getPlaylistData}>
        Get Spotify playlist data
      </button>
    }

    if ( this.state.playlist != "NULL" ) {
      console.log(this.state.playlist);
    }

    return (
      <Fragment>

        {/* {this.state.profile && 
          <div>
          Logged in as: {this.state.profile.display_name}
          </div>
        } */}

        {this.state.playlist == 'NULL' && data_button}

        {this.state.playlist != 'NULL' &&
          <span>
          Playlist: {this.state.playlist.name} 
          </span>
        }
      
        <table className='PlaylistTable'>
                <PlaylistHeader/>

                {this.state.playlist != 'NULL' && this.state.playlist.tracks.items.map(
                  song => <PlaylistRow user = {this.state.profile.display_name} rowSong = {song} />
                  )}
        </table>
      </Fragment>
    );
  }
};

export default PlaylistTable;