import React, { Fragment } from 'react';
import axios from 'axios';
import "./CommentBox.css"

var azure_public_ip = '52.246.250.124' // Static IP from Azure VM
var database_port = 4500;
var mongodb_azure_url = 'http://' + azure_public_ip + ':' + database_port;
var local_db_url = 'http://localhost:' + database_port

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const monthNamesShort = ["Jan", "Feb", "March", "April", "May", "June",
  "July", "August", "Sep", "Oct", "Nov", "Dec"
]

const comment_default_limit = 3

function formattedDate(date) {

  var d = new Date(date),
      month = '' + (monthNamesShort[d.getMonth()]),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hour = d.getHours(),
      minute = d.getMinutes()

  var am_or_pm;
      
  // Want formatting as Mar 3, 2011
  if (hour > 12) {
    hour = (hour - 12)
    am_or_pm = " PM"
  }
  else {
    am_or_pm = " AM"
  }

  if (minute.toString().length == 1) {
    minute = "0" + minute
  }
  var dateString = month+" "+day+", "+year+" at "+hour+":"+minute+am_or_pm

  return dateString
}

class CommentBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        //session_comments: this.props.song_comments,
        session_comments: (typeof(this.props.song_comments) === 'undefined') ? [] : this.props.song_comments.reverse(),
        show_all: false,
        newly_posted_comment_count: 0
    }
    console.log("Array of song comments from the database:", this.props.song_comments)
  }

  componentDidMount () {
    console.log("In CommentBox's componentDidMount.")
    // Because we want to update the UI after a comment deletion, we should immediately make sure the state
    // of the CommentBox contains all the comment objects from the song_comments prop, e.g. in session_comments,
    // rather than 
    // Then, when rendering, only session_comments is shown. After deletion, simply call setState and 
    // change the contents of session_comments to reflect the change.
    


  }

  showAllComments = () => (
    this.setState( {show_all:  true  } )
  )
  
  // Send a submitted comment to the database.
  handleSubmit = event => {
      event.preventDefault()

      // Get the current date and time.
      var date_and_time = Date()
      // Get the current user.
      var user = this.props.user
      // Get the comment itself. 
      var comment = event.target.comment.value

      var comment_info = {
          comment: comment,
          date_and_time: date_and_time,
          song_title: this.props.song,
          song_id: this.props.id,
          playlist_id: this.props.playlist_id,
          artist : this.props.artist,
          user : user
      }

      // axios.post(`${mongodb_azure_url}` + '/submit_comment', comment_info)
      //   .then( res => console.log(res))

      // NEW CODE FOR RE-CONFIGURED DATABASE BELOW
 
      axios.post( `${local_db_url}/post_comment`, comment_info )
      // .then(  response => console.log(response)  )

      // END OF NEW-DATABASE-RELATED CODE

      var comment_to_add = {"comment": comment, "date_and_time": date_and_time, "user": user}
      this.setState( {
        // session_comments: this.state.session_comments.concat([ comment_to_add]),
        session_comments: [comment_to_add].concat(this.state.session_comments),
        newly_posted_comment_count : this.state.newly_posted_comment_count + 1
      
      })
    } 


    makeComment = (commentObject, commentIndex) => {
      var comment = commentObject.comment,
          user = commentObject.user,
          date_and_time = commentObject.date_and_time

      return <div>
        {comment}<span className="CommentInfo">- {user}, {formattedDate(date_and_time)}</span>
        {user == this.props.user && <button onClick = {() => this.deleteComment( date_and_time, commentIndex )}>Delete</button> }
      </div>
    }

    // Delete a comment from the database

    // Input: some type of identifer to get the comment to be deleted, either from 
    // the "props" comments or from the session_comments (i.e. the most recent comments)
    // TO DO: DETERMINE WHAT THE IDENTIFIER IS ^
    // Output: (nothing)
    // Desired outcomes: 
    // 1) delete the comment from the database
    // if CommentBox's comment array exactly mirrors the corresponding song_comments array in 
    // the database, then the input can simply be the array index
    //  1a) Make an axios call, supplying the proper parameter(s)
    //  1b) Handle the rest on the backend
    // 2) update the UI accordingly.
    //  2a) step 1...
    //  2b) step 2...

    // 4/6/20 TO DO: make the Axios request below a POST request, and pass the database server a 
    // copy of the to-be-deleted comment's date_and_time field. Then, on the backend, simply
    // use this string as an identifier for a $pull array modifier, which will then remove the comment
    // from the database.

    deleteComment = ( comment_date_and_time, commentIndex  ) => {
      console.log("In deleteComment")
      // Make Axios deletion request
      // input: playlist_id, song_id, date_and_time
      var playlist_id = this.props.playlist_id,
          song_id = this.props.id,
          delete_comment_url_local = `${local_db_url}/delete_comment`,
          comment_deletion_info = {
            playlist_id : playlist_id,
            song_id : song_id,
            date_and_time : comment_date_and_time
          }

      axios.post( delete_comment_url_local, comment_deletion_info ).then( response => console.log(response.data) )

      // TO DO: Update the frontend to perfectly reflect changes to the database.
      // Notes...
      // user could have deleted either: 1) a props comment, or 2) a session comment

      var session_comments_duplicate = [...this.state.session_comments]
      session_comments_duplicate.splice(commentIndex, 1)
      this.setState({ session_comments : session_comments_duplicate })
    }

    showComments = () => {
     
      if ( typeof(this.state.session_comments) != 'undefined' ) {
       //var reversed_comments = this.state.session_comments.reverse()
       
        if (this.state.show_all == true) {
          return this.state.session_comments.map( (commentObj, commentIndex) => this.makeComment(commentObj, commentIndex))
        }
        else {
          return this.state.session_comments.slice(0,3 + this.state.newly_posted_comment_count).map( (commentObj, commentIndex) => this.makeComment(commentObj, commentIndex))
        }
      }
      // Handling case where session_comments is nonzero but props.song_comments is undefined!
      // else if ( typeof(this.state.session_comments) != 'undefined') {
      //   return this.state.session_comments.map( (commentObj, commentIndex) => this.makeComment(commentObj, commentIndex))
      // }

    }

    componentDidUpdate(prevProps, prevState) {
      // compare prev comments to new comments
      if (prevState.comments != this.state.session_comments) {
        // console.log("State change")
        // this.setState( {comments: comments} )
      }
    }

  render() {
    return (
      <div>
        
        <form onSubmit={this.handleSubmit}>
            <input type="text" name="comment"/>
            <input type="submit" value="Submit"/>
        </form>

        {this.showComments()}

        <button onClick = {this.showAllComments}>See more comments</button>
        
      </div>

       
    );
  }
}

export default CommentBox;