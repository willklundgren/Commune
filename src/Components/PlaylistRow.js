import React, { Fragment } from 'react';
import CommentBox from "./CommentBox"
import './PlaylistRow.css'
import { render } from '@testing-library/react';

class PlaylistRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          playlist: "NULL",
          profile: false
        };
      }

    render() {
        return (
        <Fragment>
            <tr>
                <td className='PlaylistRow'>{this.props.rowSong.track.name}</td>
                <td className='PlaylistRow'>
                    <CommentBox id = {this.props.rowSong.track.id}
                     user = {this.props.user} 
                     song = {this.props.rowSong.track.name} />
                </td>
            </tr>
        </Fragment>
        );
    }
}

export default PlaylistRow;
