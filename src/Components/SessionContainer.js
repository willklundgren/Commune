import React, { Fragment } from 'react';
import { useLocation, Redirect, Switch, Route, useRouteMatch } from "react-router-dom";
import './SpotifyLogin.css';
import axios from 'axios';
import NavBar from './NavBar';
import PlaylistSelector from "./PlaylistSelector"

function getAccessToken ( url ) {
  if (url == "/") {
    return ["ACCESS", "REFRESH", false];
  }
  else {
    url = url.split("=");
    // console.log(url[1].split("&")[0])

    // var access_token = url[1].slice(0,162); old method
    var access_token = url[1].split("&")[0];
    var refresh_token = url[2];
    return [access_token, refresh_token, true];
  }
}

class SessionContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userSessionInfo: "NULL"
    }
  }

  componentDidMount() {
    var access_token, refresh_token, gotTokens, url_string, userSessionInfo, profileRequest
      
    // Extract the access and refresh tokens from the pathname in sessionInfo prop
    [access_token, refresh_token, gotTokens] = getAccessToken(this.props.sessionInfo.location.pathname)
    console.log("access token is:", access_token)

    // Make a request to get user info using axios
    url_string = "https://api.spotify.com/v1/me"
    axios.get( url_string, {
        headers: {
          "Authorization": "Bearer " + access_token
        }
      }).then( profile =>

        this.setState( {
          userSessionInfo : {
              access_token: access_token,
              refresh_token: refresh_token,
              user_id: profile.data.id,
              user_display_name: profile.data.display_name
          }
        }
        )
      )
  }

  render() {
    return (
      <Fragment>
          {/* { this.state.userSessionInfo == "NULL" && <div> Loading.... </div> } */}

          { this.state.userSessionInfo != "NULL" &&
            <Redirect to={{ 
                  pathname:"/select_playlist", 
                  state: { userSessionInfo : this.state.userSessionInfo }
            }}  />
          }
      </Fragment>
    )
  }
}

export default SessionContainer