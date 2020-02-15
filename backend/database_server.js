var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var MongoClient = require("mongodb").MongoClient;

// Taken from CosmosDB instance on Azure...
var url = "mongodb://bp-db:WAowx88FJvtWo4YvTTW9LtLpcd2Vyf4ZzQJNP7sAMLIuwCW1UgjGe2P8w3D4bQfeMoPbwEzs7nOe2QqRiZWsHw%3D%3D@bp-db.documents.azure.com:10255/?ssl=true";
var url_local = "mongodb://localhost:27017";
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

console.log(`Database server starting on ${database_port}`)
app.listen(database_port);

