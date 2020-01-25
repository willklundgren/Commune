import React, { Fragment } from 'react';
import axios from 'axios';
import "./CommentBox.css"
// import { request } from 'express';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const monthNamesShort = ["Jan", "Feb", "March", "April", "May", "June",
  "July", "August", "Sep", "Oct", "Nov", "Dec"
]

function formattedDate(date) {
  var d = new Date(date),
      month = '' + (monthNamesShort[d.getMonth()]),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hour = d.getHours(),
      minute = d.getMinutes();

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
  if (minute.length == 1) {
    // console.log(minute)
    minute = "0" + minute.toString() 
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
        comments: []
    };
  }

  // Load the song's comments from the database.
  // Put them in the CommentBox's state.
  getComments = () => {
    var song_id = this.props.id;
    console.log("Loading past comments...")
    // console.log(`http://localhost:4500/song_comments/${song_id}`)
    axios.get(`http://localhost:4500/song_comments/${song_id}`)
      .then( (response) => {
      if (response.data != "No comments exist!") {
        this.setState( {comments: response.data.comments} )
      }
      console.log(response.data)
    })
      // .then( response => console.log(response) )
    // console.log(this.state.comments);
  }
  


  // Send a submitted comment to the database.
  handleSubmit = event => {
      event.preventDefault()

      // Get the current date and time.
      var date_and_time = Date();
      // console.log(date_and_time)
      // Get the current user. Pass as a prop
      // console.log(this.props.user)
      var user = this.props.user;
      // Get the comment itself. 
      // console.log(event.target.comment.value);
      var comment = event.target.comment.value;

      var comment_info = {
          comment: comment,
          date_and_time: date_and_time,
          song: this.props.song,
          song_id: this.props.id,
          user : user
      }

      axios.post("http://localhost:4500/submit_comment", comment_info)
        .then( res => console.log(res))

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
        var all_comments = this.state.comments.map(
          comment => this.makeComment(comment)
          ).reverse()
        
        return all_comments;
      }
    }

    componentDidUpdate(prevProps, prevState) {
      // compare prev comments to new comments
      if (prevState.comments != this.state.comments) {
        console.log("State change")
        // this.setState( {comments: comments} )
      }
    }

    // const jsxtest = ( <div>whoa!</div> )

  render() {
    return (
      <div>
        
        <form onSubmit={this.handleSubmit}>
            <input type="text" name="comment"/>
            <input type="submit" value="Submit"/>
        </form>

        {this.showComments()}

        <button onClick = {this.getComments}>See more comments</button>
        
      </div>

       
    );
  }
}

export default CommentBox;