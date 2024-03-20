import libraryFetch from '../../axios/config';
import { useState } from 'react';
import { useNavigate, useOutletContext, Link } from 'react-router-dom';

import './Login.css'

const Register = () => {
  const [, setLoginState] = useOutletContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const register = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error('Passwords do not match!');
      return;
    }
    try {
      const response = await libraryFetch.post('/register', {
        username: username,
        email: email,
        password: password
      });const { token } = response.data;

      localStorage.setItem('token', token);

      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      setLoginState({ isLoggedIn: true, isAdmin: decodedToken.type === 'admin', image: decodedToken.image, id: decodedToken.userId });

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
            <div className="formControl">
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input name='confirmPassword' type="password" id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <input type="submit" value="Register" className="btn" />
        </form>
        <p className='redirect'>Already have an account? <Link to={"/login"}>Login</Link></p>
    </div>
  )
};

export default Register;