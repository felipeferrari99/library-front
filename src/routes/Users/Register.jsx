import libraryFetch from '../../axios/config';
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

import './Login.css'

const Register = () => {
  const [, setLoginState] = useOutletContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const register = async (e) => {
    e.preventDefault();
    try {
      const response = await libraryFetch.post('/register', {
        username: username,
        email: email,
        password: password
      });

      const { token } = response.data;

      localStorage.setItem('token', token);

      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      setLoginState({ isLoggedIn: true, isAdmin: decodedToken.type === 'admin' });

      navigate('/books');
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }

  return (
    <div className="login">
        <h2>Register</h2>
        <form onSubmit={register}>
            <div className="formControl">
                <label htmlFor='username'>Username</label>
                <input name='username' type="text" id="username" onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="formControl">
                <label htmlFor='email'>E-mail</label>
                <input name='email' type="email" id="email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="formControl">
                <label htmlFor='password'>Password</label>
                <input name='password' type="password" id="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <input type="submit" value="Register" className="btn" />
        </form>
    </div>
  )
};

export default Register;