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

// 3/30/20 BELOW
// Get a playlist's comments.
// If the playlist doesn't exist, create a MongoDB document with an empty
// ...playlist_comments array.
app.get("/playlist_comments/:playlist_id", function (req, res) {

  MongoClient.connect(url_local, function(err, client) {
    // console.log("GET request for playlist comments recieved.")
    // console.log("getting past comments...")
    // console.log(req.params)
    var requested_playlist_id = req.params.playlist_id
    // console.log(requested_song_id)
    // Make DB call, and send back json object of data
    var db = client.db("playlist_info")
    db.collection('commentary_new').findOne({_id: requested_playlist_id}, {projection: {_id:0, playlist_comments:1}}, function(err, result) {
    if (err) throw err;
    // console.log(result)
    // if you found something, send it back.
    else if (result != null) {
      res.json(result);
    }
    else {
      
      db.collection('commentary_new').insertOne({
        _id: requested_playlist_id,
        playlist_comments: {}
      })

      res.send("Playlist wasn't in database. ")
    }
    client.close()
    })
    // console.log("comments to send back", res);
  })
})

// Goal: retrieve an entire playlist's comments in one API call.

// Idea: once a playlist is loaded (from PlaylistSelector component), make a call to this one function.
// ...then, simply pass the comment object corresponding to each song ID to each row (where one row = one song)
// ...and proceed as normal. This avoids making many calls to the database server at one time.

// Notes...
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
    song = req.body.song,
    song_id = req.body.song_id,
    playlist_id = req.body.playlist_id,
    user = req.body.user,
    mongo_db_field_update = `playlist_comments.${song_id}`
    console.log(mongo_db_field_update)

    MongoClient.connect(url_local, function(err,client) {
      if (err) throw err;
      var db = client.db("playlist_info")

          db.collection('commentary_new').updateOne(
            {_id : req.body.playlist_id },
            { $push: { [mongo_db_field_update] : comment } }
          )

        // }

      // db.collection("commentary_new").insertOne(
      //     { 
      //       _id: "spotify playlist ID", // <-- the Spotify playlist ID. Remember that the _id field applies on a per-document basis.
      //       playlist_name: "beet chamber", // include in Express call.
      //       // NOTE: playlist_comments is an object of objects, where each object is a song and its corresponding comments
      //       playlist_comments: {

      //         spotify_song_id_1 :
                

      //           spotify_song_id_2 : // <-- include in Express call.
      //           {
      //             // song_id: "Spotify song ID 2", <-- unnecessary
      //             song_title: "Spotify song title",
      //             song_comments: [
      //               {
      //                 comment: "pretty good",
      //                 date_and_time: "3/2/10",
      //                 user: "will gren"
      //               },
      //               {
      //                 comment: "pretty bad",
      //                 date_and_time: "3/5/10",
      //                 user: "will gren"
      //               }
      //             ]
      //           }

              

      //       }
              
      //     },
      //     function(err,res) {
      //       if (err) throw err
      //       client.close()
      //     }
      //   )
      }
    )
  res.send("Comment posted to database. Awesome.")
  }
)

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
          )
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

// Add an API call for deleting a comment!

console.log(`Database server starting on ${database_port}`)
app.listen(database_port);

