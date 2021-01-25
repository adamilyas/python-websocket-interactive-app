import './App.css';
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import InteractiveRoom from './components/InteractiveRoom.jsx'

function App() {
  return (
    <Router>
      <div>
        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>

          <Route exact path="/">
            <JoinSession />
          </Route>

          <Route exact path="/chatroom" component={InteractiveRoom} />
        </Switch>
      </div>
    </Router>
  );
}

function JoinSession() {

	const buttonStyle = {
		outline:"none",
    color: "white",
    textDecoration: "none",
    border: "solid",
    padding: "5px",
    borderRadius: "10px"
	}

  const [inputVal, setInputVal] = useState('');

  return (
    <div className="App">

			<div className="joinSession">
        <input
          value={inputVal} 
          onChange={event => setInputVal(event.target.value)}
          type="text" placeholder="Name" autoFocus
        />

        <br/> <br/>
        <Link 
        to={{
          pathname:'/chatroom',
          displayName: inputVal, 
        }} 
        style={buttonStyle}>
          Join Session
        </Link>
			</div>
    </div>
  );
}

export default App;
