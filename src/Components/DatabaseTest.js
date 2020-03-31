import React,{ Fragment } from 'react';
import axios from 'axios'

var azure_public_ip = '52.246.250.124' // Static IP from Azure VM
var database_port = 4500;
var mongodb_azure_url = 'http://' + azure_public_ip + ':' + database_port
var local_db_url = 'http://localhost:' + database_port

class DatabaseTest extends React.Component {
    constructor(props) {
      super(props)
    }

    callNewDatabase = () => {
        var beet_chamber_id = '5CtBwfw7lpoOpDavXjchp0'
        var comment_info = {
          comment: "another one",
          date_and_time: "date_and_time",
          song: "song",
          song_id: "spotify song id 3",
          playlist_id: beet_chamber_id,
          user : "user"
        }
        
        // console.log("in callNewDatabase")
        // axios.post(`${local_db_url}/post_playlist_comments`, comment_info)
        // .then( res => console.log(res.data) )
        axios.post(`${local_db_url}/post_comment`, comment_info)
        .then( res => console.log(res.data) )
        
    }
  
    render() {
      return (
         <button onClick={this.callNewDatabase}>Database Test</button>
      )
    }
  }
  
  export default DatabaseTest;