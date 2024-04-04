import NavbarComponent from './components/Navbar';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      <ToastContainer
      position="bottom-right"
      autoClose={2000}
      limit={3}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick
      theme="dark" />
    </div>
  );
};

const EventBusNavbar = ({ loginState, setLoginState }) => {
  const eventBus = new EventTarget();

  return (
    <>
      <NavbarComponent loginState={loginState} setLoginState={setLoginState} eventBus={eventBus} />
    </>
  );
};

export default App;