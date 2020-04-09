var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var MongoClient = require("mongodb").MongoClient

// Taken from CosmosDB instance on Azure...
var url = "mongodb://bp-db:WAowx88FJvtWo4YvTTW9LtLpcd2Vyf4ZzQJNP7sAMLIuwCW1UgjGe2P8w3D4bQfeMoPbwEzs7nOe2QqRiZWsHw%3D%3D@bp-db.documents.azure.com:10255/?ssl=true";
var url_local = "mongodb://localhost:27017"
// var url_local = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false'
var database_port = 4500;

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use(cors())

// Posting a commment.
app.post("/submit_comment", (req, res) => {
  // console.log("Request body: ", req.body)

  // Post to MongoDB
  MongoClient.connect(url, function(err, client) {
    if (err) throw err;
    console.log("POST request recieved to submit a comment.")
    // console.log(req.body)
    var db = client.db("playlist_info");

    // See if the song ID already exists in the database.
    // If not, create an entry for it. If it does, add it.

    db.collection("commentary").findOne( {_id: req.body.song_id} , (err, result) => {
      if (err) throw err;
      if (result != null) {
        // console.log(result.song, "already in database.")
        // Use update function here.
        // console.log(req.body.song_id)
        db.collection('commentary').updateOne(
          {_id : req.body.song_id},
          { $push: {comments: 
            { comment: req.body.comment,
              date_and_time: req.body.date_and_time,
              user: req.body.user
            }
          }}
        );
      }
      else {
        // console.log("Song not in database.")   
        db.collection('commentary').insertOne({
          _id: req.body.song_id,
          song: req.body.song,
          comments: [
            {
              comment: req.body.comment,
              date_and_time: req.body.date_and_time,
              user: req.body.user
            }
          ]
        })

      }
      
    })
    // client.close()
  })
})

app.get("/song_comments/:song_id", function (req, res) {
  MongoClient.connect(url, function(err, client) {
    console.log("GET request for database comments recieved.")
    // console.log("getting past comments...")
    // console.log(req.params)
    var requested_song_id = req.params.song_id;
    // console.log(requested_song_id)
    // Make DB call, and send back json object of data
    var db = client.db("playlist_info");
    db.collection('commentary').findOne({_id: requested_song_id}, {projection: {_id:0, comments:1}}, function(err, result) {
    if (err) throw err;
    // console.log(result)
    // if you found something, send it back.
    else if (result != null) {
      res.json(result);
    }
    else {
      res.send("No comments exist!")
    }
    client.close()
    });
    // console.log("comments to send back", res);
  })
})

// Get a playlist's comments.
// If the playlist doesn't exist, create a MongoDB document with an empty
// ...playlist_comments array.
app.get("/playlist_comments/:playlist_id/:playlist_name", function (req, res) {
  console.log("in playlist_comments")

  MongoClient.connect(url_local, function(err, client) {
    var requested_playlist_id = req.params.playlist_id,
        playlist_name = req.params.playlist_name
    // Make DB call, and send back json object of data
    var db = client.db("playlist_info")
    db.collection('commentary_new').findOne({_id: requested_playlist_id},
      {projection: {_id:0, playlist_comments:1,}}, function(err, result) {
      if (err) throw err;
      // if you found something, send it back.
      else if (result != null) {
        // FUTURE WORK (SEE TODOIST):
        // FILTER OUT THE "song" MongoDB field before sending the
        // playlist data to the frontend.
        res.json(result);
      }
      else {
        
        db.collection('commentary_new').insertOne({
          _id: requested_playlist_id,
          playlist_name : playlist_name,
          playlist_comments: {}
        })
        res.send("Playlist wasn't in database. Created an empty MongoDB document for it.")
      }
    client.close()
    })
  })
})

// Goal: retrieve an entire playlist's comments in one API call.

// Idea: once a playlist is loaded (from PlaylistSelector component), make a call to this one function.
// ...then, simply pass the comment object corresponding to each song ID to each row (where one row = one song)
// ...and proceed as normal. This avoids making many calls to the database server at one time.

// Input: a Spotify playlist ID
// First attempt with the new experimental collection, "commentary_new"

// 2 options when posting:
// 1) song already exists in document (and therefore has at least 1 comment)

// 2) song doesn't exist in document and needs to be added, along 
// ... with its associated comment

app.post("/post_comment", function (req, res) {
  console.log("in post_comment Express function")
  var comment = req.body.comment,
    date_and_time = req.body.date_and_time,
    song_title = req.body.song_title,
    song_id = req.body.song_id,
    playlist_id = req.body.playlist_id,
    user = req.body.user,
    mongo_db_field_update_song_title = `playlist_comments.${song_id}.song`,
    mongo_db_field_update_song_comments = `playlist_comments.${song_id}.song_comments`,
    artist = req.body.artist

  var song = `${song_title} by ${artist}`

  var comment_info = {
    comment: comment,
    date_and_time: date_and_time,
    user: user
  }

  MongoClient.connect(url_local, function(err,client) {
    if (err) throw err;
    var db = client.db("playlist_info")

    db.collection('commentary_new').updateOne(
      {_id : playlist_id },
      { 
        $set: { 
          [mongo_db_field_update_song_title] : song
        }
      } 
    )

    db.collection('commentary_new').updateOne(
      {_id : playlist_id },
        { 
          $push: { [mongo_db_field_update_song_comments]: comment_info }
        } 
    )

    client.close()
    }
  )
  res.send("Comment posted to database. Awesome.")
  }
)

// Delete a comment
app.post("/delete_comment", function (req, res) {
  console.log("in post_comment Express function")
  var deletion_date_and_time = req.body.date_and_time,
    song_id = req.body.song_id,
    playlist_id = req.body.playlist_id,
    mongo_db_field_update_song_comments = `playlist_comments.${song_id}.song_comments`

  console.log("change???")

  MongoClient.connect(url_local, function(err,client) {
    if (err) throw err
    var db = client.db("playlist_info")
    db.collection('commentary_new').updateOne(
      {_id : playlist_id },
      { 
          $pull : { [mongo_db_field_update_song_comments] : {date_and_time: deletion_date_and_time }   }
      } 
    )

    client.close()
    }
  )
  res.send("Comment deleted.")
  }
)

console.log(`Database server starting on ${database_port}`)
app.listen(database_port);

