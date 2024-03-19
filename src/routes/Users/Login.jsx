import libraryFetch from '../../axios/config';
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import './Login.css'

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
      console.log(decodedToken)

      setLoginState({ isLoggedIn: true, isAdmin: decodedToken.type === 'admin', image: decodedToken.image, id: decodedToken.userId });
      navigate('/books');
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  return (
    <div className="login">
        <h2>Login</h2>
        <form onSubmit={login}>
            <div className="formControl">
                <label htmlFor='username'>Username</label>
                <input name='username' type="text" id="username" onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="formControl">
                <label htmlFor='password'>Password</label>
                <input name='password' type="password" id="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <input type="submit" value="Login" className="btn" />
        </form>
    </div>
  )
};

export default Login;