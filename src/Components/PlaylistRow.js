import React, { Fragment } from 'react';
import CommentBox from "./CommentBox"
import './PlaylistRow.css'
import { render } from '@testing-library/react';

const monthNamesShort = ["Jan", "Feb", "March", "April", "May", "June",
  "July", "August", "Sep", "Oct", "Nov", "Dec"
]

class PlaylistRow extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          playlist: "NULL",
          profile: false
        }
      }
      
    formatDate = (javascriptDateObject) => {
        // sample output: Jan 4, 2020
        var month = monthNamesShort[javascriptDateObject.getMonth()],
        day = javascriptDateObject.getDate(),
        year = javascriptDateObject.getFullYear(),
        hour = javascriptDateObject.getHours(),
        minute = javascriptDateObject.getMinutes()

        var formattedDateString = `${month} ${day}, ${year}`
        return formattedDateString
    }  
    
    render() {
        return (
        <Fragment>
            <tr>
                <td className='PlaylistRow'>{this.props.song_title}</td>
                <td className='PlaylistRow'>{this.props.artist}</td>
                <td className='PlaylistRow'>{this.formatDate(new Date(this.props.date_added))}</td>
                <td className='PlaylistRow'>
                    <CommentBox
                     id = {this.props.song_id}
                     user = {this.props.user}
                     song = {this.props.song_title}
                     playlist_id = {this.props.playlist_id}
                     song_comments = { typeof(this.props.song_comments) === 'undefined' ? undefined : this.props.song_comments.song_comments}
                     artist = {this.props.artist}
                    />
                </td>
            </tr>
        </Fragment>
        );
    }
}

export default PlaylistRow;
