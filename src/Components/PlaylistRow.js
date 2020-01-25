import React, { Fragment } from 'react';
import CommentBox from "./CommentBox"
import './PlaylistRow.css'

function PlaylistRow (props) {
    // console.log(props);
    return (
      <Fragment>
          <tr>
              <td className='PlaylistRow'>{props.rowSong.track.name}</td>
              <td className='PlaylistRow'><CommentBox id = {props.rowSong.track.id} user = {props.user} song = {props.rowSong.track.name} />

              </td>
          </tr>
      </Fragment>
    );
}

export default PlaylistRow;
