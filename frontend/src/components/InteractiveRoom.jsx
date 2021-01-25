import React, { useState } from 'react';
import {Redirect} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export default class InteractiveRoom extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        id: '',
        displayName: props.location.displayName,
        ws: null,
        x: 0, 
        y: 0,
        usersMap: new Map(),
      }
    }
  
    // const [usersMap, setUsersMap] = useState(new Map());

    componentDidMount(){
      this.setState({id: uuidv4(), displayName: this.state.displayName})
      this.connect();
    }
  
    componentWillUnmount(){
      this.setState({"displayName": null})
      if (this.state.ws != null) {
        this.state.ws.close();
      }
    }
  
    connect = () => {
      const host_url = window.location.host
      const websocket_url = `ws://${host_url}/chat`
      const ws = new WebSocket(websocket_url);
        // websocket onopen event listener
        ws.onopen = () => {
          console.log(`websocket connected at ${websocket_url}`);
          this.setState({ ws: ws });
      };

        // websocket onclose event listener
        ws.onclose = e => {
          console.log("Socket is closed")
        };

        ws.onmessage = e => {
          
          // oncoming
          let data = JSON.parse(e.data)

          if (data.id != null && data.id !== this.state.id) {
            let usersMap = this.state.usersMap
          
            if (data.x === -1 && data.y === -1){
              // leave the room
              usersMap.delete(data.id)
            } else {
              usersMap.set(data.id, data)
            }

            this.setState(usersMap)

          } // else dont do anything
        }

        // websocket onerror event listener
        ws.onerror = err => {
          console.error(
              "Socket encountered error: ",
              err.message,
              "Closing socket"
          );

          ws.close();
      };
    }

    _onMouseMove(e) {
      let mouseX = e.clientX
      let mouseY = e.clientY
      this.setState({x: mouseX, y: mouseY });

      const ws = this.state.ws
      if (ws != null && ws.readyState === 1) {
        let data = {id: this.state.id, x: mouseX, y: mouseY, displayName: this.state.displayName}
        let json_data = JSON.stringify(data)
        this.state.ws.send(json_data)
      }
    }

    render() {
  
      let displayName = this.state.displayName

      if (displayName == null || displayName === '') {
        return <Redirect to={'/'} />
      }

      const style = {
        height: "100vh",
        width: "100%",
        padding: "0",
        margin: "0"
      }

      const { x, y, usersMap } = this.state;

      return (
        <div className="interactiveRoom" onMouseMove={this._onMouseMove.bind(this)} style={style} >
          {Math.random()} {displayName} { x } { y }

          <UserList usersMap={usersMap}/>
        </div>
      );
    }
  }


// position of each user 
function UserList({usersMap}) {

    if (usersMap.size === 0) {
      return <div></div>
    }

    let users = Array.from(usersMap.values())

    return users.map((user) => {
        const style = {
            position: "absolute",
            top: `${user.y}px`,
            left: `${user.x}px`,
            fontSize: "30px",
            color: "red"
        }
        return <div key={user.id} style={style}>{user.name}</div>
    })
}