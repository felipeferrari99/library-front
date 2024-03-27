'use client';

import libraryFetch from '../../axios/config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { FloatingLabel } from 'flowbite-react';
import Button from '../../components/Button';

const Login = () => {
  const [, setLoginState] = useOutletContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await libraryFetch.post('/login', {
        username: username,
        password: password
      });

      const { token } = response.data;

      localStorage.setItem('token', token);

      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      setLoginState({ isLoggedIn: true, isAdmin: decodedToken.type === 'admin', image: decodedToken.image, id: decodedToken.userId, username: username });
      navigate('/books');
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-2xl text-center font-semibold mb-6">Login</h2>
      <form onSubmit={login}>
          <div className="grid grid-flow-col justify-stretch space-x-4">
              <FloatingLabel variant="filled" label="Username" name='username' type="text" id="username" onChange={(e) => setUsername(e.target.value)}/>
          </div>
          <div className="grid grid-flow-col mt-5 mb-5 justify-stretch space-x-4">
              <FloatingLabel variant="filled" label="Password" name='password' type="password" id="password" onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <Button children='Login' />
      </form>
      <p className="mt-6 text-gray-500">Don't have an account yet? <a href='/register' className="text-blue-500 hover:text-blue-700">Register</a></p>
    </div>
  )
};

export default Login;