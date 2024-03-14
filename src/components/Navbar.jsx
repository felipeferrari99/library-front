import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import './Navbar.css'

const Navbar = ({ loginState, setLoginState, eventBus }) => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(loginState.isLoggedIn);
  const [isAdmin, setIsAdmin] = useState(loginState.isAdmin);
  const [image, setImage] = useState(loginState.image);
  const [id, setId] = useState(loginState.id);

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setImage('');
    setId('');
    setLoginState({ isLoggedIn: false, isAdmin: false });
    navigate('/');
  };

  useEffect(() => {
    setIsLoggedIn(loginState.isLoggedIn);
    setIsAdmin(loginState.isAdmin);
    setId(loginState.id)
    setImage(loginState.image)
  }, [loginState]);

  useEffect(() => {  
    const handleLoginEvent = (event) => {
      setIsLoggedIn(event.detail.isLoggedIn);
      setIsAdmin(event.detail.isAdmin);
    };

    eventBus.addEventListener('userLoggedIn', handleLoginEvent);

    return () => {
      eventBus.removeEventListener('userLoggedIn', handleLoginEvent);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setIsLoggedIn(true);
        setIsAdmin(decodedToken.type === 'admin');
        setId(decodedToken.userId);
        setImage(decodedToken.image);
      } catch (err) {
        logout();
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, [setLoginState]);

  return (
    <nav className='navbar'>
        <h2>
            <Link to={'/'}>Library</Link>
        </h2>
      {isLoggedIn ? (
        <>
          <ul>
            <li><Link to="/rents">Rents</Link></li>
            {isAdmin && (
              <>
                <li><Link to="/newBook">New Book</Link></li>
                <li><Link to="/newAuthor">New Author</Link></li>
              </>
            )}
            <li><button onClick={logout}>Logout</button></li>
          </ul>
          <Link to={`/user/${id}`}>
            <img style={{width: '3rem', height: '3rem'}} src={image}/>
          </Link>
        </>
      ) : (
        <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;