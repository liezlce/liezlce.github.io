<<<<<<< HEAD
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
=======
import './App.css';
import { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import io from 'socket.io-client';
import Home from './pages/home';
import Chat from './pages/chat';


const socket = io.connect('http://localhost:4000'); 

function App() {
  const [username, setUsername] = useState(''); 
  const [room, setRoom] = useState(''); 

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              <Home
                username={username} 
                setUsername={setUsername}
                room={room} 
                setRoom={setRoom} 
                socket={socket} 
              />
            }
          />
          <Route
            path='/chat'
            element={
            <Chat 
            username={username} 
            room={room} 
            socket={socket} 
            />
          }
        />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
>>>>>>> origin/bryan_branch
