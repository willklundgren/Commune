import React, { Fragment } from 'react';
import axios from 'axios';
import "./CommentBox.css"
// import { request } from 'express';

var azure_public_ip = '52.246.250.124' // Static IP from Azure VM
var database_port = 4500;
var mongodb_azure_url = 'http://' + azure_public_ip + ':' + database_port; 

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

  // console.log(minute.toString.length)
  if (minute.toString().length == 1) {
    minute = "0" + minute
  }

  var dateString = month+" "+day+", "+year+" at "+hour+":"+minute+am_or_pm

  // return <span >{dateString}</span>
  return dateString
}

class CommentBox extends React.Component {
  constructor(props) {
    super(props);
    // "comments" needs to be an array of comment objects, mirroring the database.
    this.state = {
        comments: [],
        show_all: false
    };
  }

  componentDidMount () {
    this.getComments()
  }

  // Load the song's comments from the database.
  // Put them in the CommentBox's state.
  getComments = () => {
    var song_id = this.props.id;
    // console.log("Loading past comments...")
    // console.log(`${mongodb_azure_url}/song_comments/${song_id}`)
    // console.log(`http://localhost:4500/song_comments/${song_id}`)
    axios.get(`${mongodb_azure_url}/song_comments/${song_id}`)
      .then( (response) => {
      if (response.data != "No comments exist!") {
        this.setState( { comments: response.data.comments.reverse().map(
          comment => this.makeComment(comment) ) } ) // reverse to order from newest->oldest
      }
      // console.log(response.data)
    })
      // .then( response => console.log(response) )
    // console.log(this.state.comments);
  }

  showAllComments = () => (
    this.setState({show_all:true})
  )
  


  // Send a submitted comment to the database.
  handleSubmit = event => {
      event.preventDefault()

      // Get the current date and time.
      var date_and_time = Date();
      // console.log(date_and_time)
      // Get the current user. Pass as a prop
      // console.log(this.props.user)
      var user = this.props.user;
      console.log("DISPLAY NAME: ", user)
      // Get the comment itself. 
      // console.log(event.target.comment.value);
      var comment = event.target.comment.value;

      var comment_info = {
          comment: comment,
          date_and_time: date_and_time,
          song: this.props.song,
          song_id: this.props.id,
          playlist_id: this.props.playlist_id,
          user : user
      }

      // axios.post(`${mongodb_azure_url}` + '/submit_comment', comment_info)
      //   .then( res => console.log(res))

      // NEW CODE FOR RE-CONFIGURED DATABASE BELOW
      var local_db_url = 'http://localhost:' + database_port
      axios.post( `${local_db_url}/post_comment`, comment_info )
      .then(  response => console.log(response)  )




      // END OF NEW-DATABASE-RELATED CODE

      /// console.log("submitted and showing comments")
      // this.getComments()
      var comment_to_add = {"comment": comment, "date_and_time": date_and_time, "user": user}
      this.setState( {comments: this.state.comments.concat([comment_to_add])})
      // this.showComments()
      
    } 


    makeComment = commentObject => {
      return <div>{commentObject.comment}<span className="CommentInfo">- {commentObject.user}, {formattedDate(commentObject.date_and_time)}</span></div>
    }

    showComments = () => {
      // console.log("in showComments function")
      // console.log(typeof(this.state.comments) != 'undefined')
      if (this.state.comments != [] && typeof(this.state.comments) != 'undefined') {
        // var shown_comments = this.state.comments.slice(0,3)
        if (this.state.show_all == true) {
          return this.state.comments
        }
        else {
          return this.state.comments.slice(0,3)
        }
        
  
      }
    }

    componentDidUpdate(prevProps, prevState) {
      // compare prev comments to new comments
      if (prevState.comments != this.state.comments) {
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