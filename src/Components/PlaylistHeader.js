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
            {this.state.selected.map(field =>
              <th className = 'PlaylistHeader'>{field}</th>)}
          </tr>
      </Fragment>
    );
  }
}

export default PlaylistHeader;