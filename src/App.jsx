import Navbar from './components/Navbar';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import './App.css'

const App = () => {
  const [loginState, setLoginState] = useState({
    isLoggedIn: false,
    isAdmin: false,
  });

  return (
    <div className="App">
      <EventBusNavbar loginState={loginState} setLoginState={setLoginState} />
      <div className="container">
        <Outlet context={[loginState, setLoginState]} />
      </div>
    </div>
  );
};

const EventBusNavbar = ({ loginState, setLoginState }) => {
  const eventBus = new EventTarget();

  return (
    <>
      <Navbar loginState={loginState} setLoginState={setLoginState} eventBus={eventBus} />
    </>
  );
};

export default App;