// Spotify OAuth2 Server
// Starter code taken from https://github.com/spotify/web-api-auth-examples

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const axios = require('axios').default;
const path = require('path');
const config = require("./config_prod.js")

// Spotify application credentials
var client_id = config.prod_config.spotify_client_id,
    client_secret = config.prod_config.spotify_client_secret

// Deployment
var azure_public_ip = config.prod_config.vm_public_ip, // Static IP from Azure VM
    frontend_port = 3000,
    spotify_port = 3223,
    redirect_uri = 'http://' + azure_public_ip + ':' + spotify_port + '/callback'; 
    // Note: redirect_uri must be registered with Spotify

var stateKey = 'spotify_auth_state'
var app = express();

app.use(express.static('build'))

app.use(cors())
   .use(cookieParser());

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  console.log("Logging in...")

  // Request authorization
  var scope = 'playlist-read-private playlist-read-collaborative'
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

var access_token, refresh_token
app.get('/callback', function(req, res, next) {
  console.log("In callback")

  // Request refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      res.clearCookie(stateKey);
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };

      request.post(authOptions, function(error, response, body) {
          if (!error && response.statusCode === 200) {

            access_token = body.access_token,
            refresh_token = body.refresh_token;

            console.log("Access token from backend:", access_token);

            // Pass tokens to browser
            res.redirect(   "/authenticated/" + 
              querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token
                  }))

          } else {
            res.redirect('/#' +
              querystring.stringify({
                error: 'invalid_token'
              }));
          }
        } 
      )
    }
  }
)

app.get('/get_all_playlist_tracks/:playlist_id/:access_token', async function( req, res ) {

    console.log("Getting all playlist tracks...")

    var playlist_id = req.params.playlist_id,
        token = req.params.access_token,
        accumulated_playlist = [],
        more_tracks = true,
        playlist_tracks_url = `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`

    while (more_tracks != null) {
      
      await axios.get( playlist_tracks_url, {
        headers: {
          "Authorization": "Bearer " + token
        }
      } ).then( tracks => {
          
          if (tracks.data.next == null) {
            console.log("about to send back tracks data...")
            if (accumulated_playlist == []) {
              accumulated_playlist = tracks.data.items
            }
            else {
              accumulated_playlist.push(...tracks.data.items)
            }
            res.send(accumulated_playlist)
            more_tracks = null
          }
          else { // there's still more tracks to retrieve...
            if (accumulated_playlist.length == 0) {
              accumulated_playlist = tracks.data.items
            }
            else {
              // accumulated_playlist = accumulated_playlist.concat(...tracks.data.items)
              accumulated_playlist.push(...tracks.data.items)
            }
            playlist_tracks_url = tracks.data.next
          }  
        }
      )
    }
  }
  
);

// Get all collaborative playlists at once.
// Input: user's Spotify ID, session access token

app.get( '/get_all_playlists/:user_id/:access_token' , async function (req, res) {
    console.log("In get_all_playlists")
    var user_id = req.params.user_id,
        token = req.params.access_token,
        accumulated_playlists = [],
        more_playlists = true,
        limit = 50,
        playlist_tracks_url = `https://api.spotify.com/v1/users/${user_id}/playlists?limit=${limit}`

    while (more_playlists != null) {
      console.log("inside get_all_playlists loop")
      await axios.get( playlist_tracks_url, {
        headers: {
          "Authorization": "Bearer " + token
        }
      } ).then( playlists => {

          var filtered_playlists = playlists.data.items
              .filter(item => item.collaborative == true)
              .map(playlist => [playlist.name, playlist.id])

          if (playlists.data.next == null) {
            console.log("about to send back data...")
            if (accumulated_playlists == []) {
              accumulated_playlists = filtered_playlists
            }
            else {
              accumulated_playlists.push(...filtered_playlists)
            }
            res.send(accumulated_playlists)
            more_playlists = null
          }
          // there's still more tracks to retrieve...
          else {
            if (accumulated_playlists.length == 0) {
              accumulated_playlists = filtered_playlists
            }
            else {
              accumulated_playlists.push(...filtered_playlists)
            }
            playlist_tracks_url = playlists.data.next
          }  
        }
      )
    }
  }
)

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.get('/*', function(req, res) {
  console.log("GET request to star function")
  res.sendFile(path.join(__dirname, 'build/index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

console.log(`Listening on ${spotify_port}`);
app.listen(spotify_port);
