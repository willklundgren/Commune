import React, { Fragment } from 'react';
import CommentBox from "./CommentBox"
import './PlaylistRow.css'
import { render } from '@testing-library/react';

const monthNamesShort = ["Jan", "Feb", "March", "April", "May", "June",
  "July", "August", "Sep", "Oct", "Nov", "Dec"
]

class PlaylistRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          playlist: "NULL",
          profile: false
        };
        console.log(this.props.rowSong)
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
                <td className='PlaylistRow'>{this.props.rowSong.track.name}</td>
                <td className='PlaylistRow'>{this.props.rowSong.track.artists[0].name}</td>
                <td className='PlaylistRow'>{this.formatDate(new Date(this.props.rowSong.added_at))}</td>
                <td className='PlaylistRow'>
                    <CommentBox id = {this.props.rowSong.track.id}
                     user = {this.props.user} 
                     song = {this.props.rowSong.track.name}
                     playlist_id = {this.props.playlist_id}
                    />
                </td>
            </tr>
        </Fragment>
        );
    }
}

export default PlaylistRow;
