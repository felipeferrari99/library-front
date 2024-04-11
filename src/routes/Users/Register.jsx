import libraryAPI from '../../axios/config';
import { registerRequest } from '../../requests/users';
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FloatingLabel } from 'flowbite-react';
import Button from '../../components/Button';
import { toast } from 'react-toastify';

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
      toast.warn('Passwords do not match');
      return;
    }
    try {
      const response = await registerRequest(username, email, password)
      
      const { token } = response;

      localStorage.setItem('token', token);

      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      setLoginState({ isLoggedIn: true, isAdmin: decodedToken.type === 'admin', image: decodedToken.image, id: decodedToken.userId, username: username });

      toast.success('Registered successfully!');
      libraryAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate('/books');
    } catch (error) {
      toast.error(`Error during registration: ${error.response.data.message}`);
    }
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-2xl text-center font-semibold mb-6">Register</h2>
      <form onSubmit={register}>
          <div className="grid grid-flow-col justify-stretch space-x-4">
              <FloatingLabel variant="filled" label="Username" name='username' type="text" id="username" onChange={(e) => setUsername(e.target.value)}/>
          </div>
          <div className="grid grid-flow-col mt-5 mb-5 justify-stretch space-x-4">
              <FloatingLabel variant="filled" label="E-mail" name='email' type="email" id="email" onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="grid grid-flow-col mt-5 mb-5 justify-stretch space-x-4">
              <FloatingLabel variant="filled" label="Password" name='password' type="password" id="password" onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className="grid grid-flow-col mt-5 mb-5 justify-stretch space-x-4">
              <FloatingLabel variant="filled" label="Confirm Password" name='confirmPassword' type="password" id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)}/>
          </div>
          <Button children='Register' />
      </form>
      <p className="mt-6 text-gray-500">Already have an account? <a href='/login' className="text-blue-500 hover:text-blue-700">Login</a></p>
    </div>
  )
};

export default Register;