// Spotify OAuth2 Server
// Starter code taken from https://github.com/spotify/web-api-auth-examples

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

// Spotify application credentials
var client_id = '0a1b0b9e8bd043b8b1c360413e26b0f3'; // My client ID
var client_secret = '4f39d523b69f47b3bee1e1662b545163'; // My secret

// Deployment
var azure_public_ip = '52.246.250.124', // Static IP from Azure VM
    frontend_port = 3000,
    spotify_port = 3223,
    redirect_uri = 'http://' + azure_public_ip + ':' + spotify_port + '/callback'; 
    // Note: redirect_uri must be registered with Spotify

// For testing purposes
var playlist_id = "2Or6Yh2QJMHmh1ccAkqfc8";
var dev = false; // Switch to "true" if in development

if (dev != false) {
  redirect_uri = 'http://localhost:' + spotify_port + '/callback'
}

var stateKey = 'spotify_auth_state';
var app = express();

app.use(express.static('build'));

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

  // your application requests authorization
  // var scope = 'user-read-private user-read-email';
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

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
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

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        console.log("Access token from backend:", access_token);

        // var options = {
        //   url: 'https://api.spotify.com/v1/me',
        // //   url: "https://api.spotify.com/v1/playlists/2Or6Yh2QJMHmh1ccAkqfc8/tracks?limit=5",
        //   headers: { 'Authorization': 'Bearer ' + access_token },
        //   json: true
        // };

        // // use the access token to access the Spotify Web API
        // request.get(options, function(error, response, body) {
        //     console.log("Access token from backend:", access_token);
        //     // console.log(body);
        // });

        // we can also pass the token to the browser to make requests from there
        res.redirect('http://' + azure_public_ip + ':' + spotify_port + '/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

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

console.log(`Listening on ${spotify_port}`);

// console.log(process.env)

app.listen(spotify_port);