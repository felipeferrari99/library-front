'use client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Dropdown, Navbar } from 'flowbite-react';

const NavbarComponent = ({ loginState, setLoginState, eventBus }) => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(loginState.isLoggedIn);
  const [isAdmin, setIsAdmin] = useState(loginState.isAdmin);
  const [image, setImage] = useState(loginState.image);
  const [id, setId] = useState(loginState.id);
  const [username, setUsername] = useState(loginState.username)

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setImage('');
    setId('');
    setUsername('');
    setLoginState({ isLoggedIn: false, isAdmin: false });
    navigate('/');
  };

  useEffect(() => {
    setIsLoggedIn(loginState.isLoggedIn);
    setIsAdmin(loginState.isAdmin);
    setId(loginState.id)
    setImage(loginState.image)
    setUsername(loginState.username)
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
        setUsername(decodedToken.username)
      } catch (err) {
        logout();
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, [setLoginState]);

  return (
  <Navbar fluid className="bg-gray-800">
    <Navbar.Brand href="/" className="flex items-center">
      <img src="favicon.ico" className="mr-3 h-6 sm:h-9" />
      <span className="self-center whitespace-nowrap text-xl font-semibold">Dream Bookshelf</span>
    </Navbar.Brand>
    {isLoggedIn && (
      <div className="flex md:order-2">
        <Dropdown arrowIcon={false}
          inline
          label={
            <Avatar alt="User settings" img={image} rounded />
          }
        >
          <Dropdown.Header>
            <span className="block text-sm">{username}</span>
          </Dropdown.Header>
          <Dropdown.Item href={`/user/${id}`}>My Profile</Dropdown.Item>
          <Dropdown.Item href={`/user/${id}/edit`}>Edit Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
        </Dropdown>
        <Navbar.Toggle />
      </div>
    )}
    {isLoggedIn && !isAdmin && (
      <Navbar.Collapse>
        <Navbar.Link className="text-white" href="/books">All Books</Navbar.Link>
        <Navbar.Link className="text-white" href="/authors">All Authors</Navbar.Link>
          <Dropdown inline label='Rents'>
            <Dropdown.Item href="/available">New Rent</Dropdown.Item>
            <Dropdown.Item href="/myRents">My Rents</Dropdown.Item>
          </Dropdown>
      </Navbar.Collapse>
    )}
    {isLoggedIn && isAdmin && (
      <Navbar.Collapse>
        <Navbar.Link href="/allRents" className="text-white">All Rents</Navbar.Link>
          <Dropdown inline label='Books'>
            <Dropdown.Item href="/books">All Books</Dropdown.Item>
            <Dropdown.Item href="/newBook">New Book</Dropdown.Item>
          </Dropdown>
          <Dropdown inline label='Authors'>
            <Dropdown.Item href="/authors">All Authors</Dropdown.Item>
            <Dropdown.Item href="/newAuthor">New Author</Dropdown.Item>
          </Dropdown>
      </Navbar.Collapse>
    )}
    {!isLoggedIn && (
      <Navbar.Collapse>
        <Navbar.Link className="text-white" href="/login">Login</Navbar.Link>
        <Navbar.Link className="text-white" href="/register">Register</Navbar.Link>
      </Navbar.Collapse>
    )}
  </Navbar>
  );
};

export default NavbarComponent;