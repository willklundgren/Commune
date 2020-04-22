import React,{ Fragment } from 'react';
import axios from 'axios'
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

var azure_public_ip = '52.246.250.124' // Static IP from Azure VM
var database_port = 4500;
var mongodb_azure_url = 'http://' + azure_public_ip + ':' + database_port
var local_db_url = 'http://localhost:' + database_port

// class DatabaseTest extends React.Component {
//     constructor(props) {
//       super(props)
//       console.log(props)
//     }

//     // callNewDatabase = () => {
//     //     var beet_chamber_id = '5CtBwfw7lpoOpDavXjchp0'
//     //     var comment_info = {
//     //       comment: "comment 1",
//     //       date_and_time: "date_and_time",
//     //       song: "song title 3",
//     //       song_id: "spotify song id 1",
//     //       playlist_id: beet_chamber_id,
//     //       user : "user"
//     //     }
        
//     //     // console.log("in callNewDatabase")
//     //     // axios.post(`${local_db_url}/post_playlist_comments`, comment_info)
//     //     // .then( res => console.log(res.data) )
//     //     axios.post(`${local_db_url}/post_comment`, comment_info)
//     //     .then( res => console.log(res.data) )
        
//     // }
  
//     render() {

//       // let { path, url } = useRouteMatch()

//       return (
//         <div>
//           <span>in DatabaseTest component</span>
//           <Switch>

//             <Route path = { `${path}/nest`   }   >
//               <span>Nest</span>
//             </Route>

//           </Switch>
//         {/* //  <button onClick={this.callNewDatabase}>Database Test</button> */}

//         </div>

//       )
//     }
//   }

  function DatabaseTest(props) {

    let { path, url } = useRouteMatch()
    console.log(props)

    return (
      
      <div>
        <span>in DatabaseTest component</span>
        <Switch>

          <Route path = { `${path}/nest`   }  >
            <span> nest - {props.routeProps.location.pathname}</span>
            <Redirect 
              to = {`${path}/hidden`}

            
            />
          </Route>

          <Route path = { `${path}/oink`   }  >
            <span> oink - {props.routeProps.location.pathname}</span>
          </Route>

          <Route 
            path = { `${path}/hidden`   }
            // render = { AuthProps => <span>{AuthProps}</span>  } 
          >
            <span> hidden - {props.routeProps.location.pathname}
            {props.glue}
            
            </span>
          </Route>
          

        </Switch>
      {/* //  <button onClick={this.callNewDatabase}>Database Test</button> */}

      </div>

    )

  }
  
  export default DatabaseTest;