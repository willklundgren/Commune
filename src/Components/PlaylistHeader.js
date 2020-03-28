import React, { Fragment } from 'react';
import './PlaylistHeader.css'

class PlaylistHeader extends React.Component {
  constructor() {
    super();
    this.state = {
      selected: ["Song", "Comments"]
    };
  }
  render() {
    return (
      <Fragment>
          <tr className="table-active">
            {/* {this.state.selected.map(field =>
              <th className = 'PlaylistHeader'>{field}</th>)} */}
              <th className = 'PlaylistHeaderSong'>Song</th>
              <th className = 'PlaylistHeaderArtist'>Artist</th>
              <th className = 'PlaylistHeaderDate'>Date Added</th>
              <th className = 'PlaylistHeaderComments'>Comments</th>
          </tr>
      </Fragment>
    );
  }
}

export default PlaylistHeader;