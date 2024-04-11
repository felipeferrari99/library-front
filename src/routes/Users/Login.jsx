import libraryAPI from '../../axios/config';
import { loginRequest } from '../../requests/users';
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FloatingLabel } from 'flowbite-react';
import Button from '../../components/Button';
import { toast } from 'react-toastify';

const Login = () => {
  const [, setLoginState] = useOutletContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false)

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await loginRequest(username, password)

      const { token } = response;

      localStorage.setItem('token', token);

      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      setLoginState({ isLoggedIn: true, isAdmin: decodedToken.type === 'admin', image: decodedToken.image, id: decodedToken.userId, username: username });
      
      toast.success('Logged in successfully!');
      libraryAPI.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate('/books');
    } catch (error) {
      toast.error(`Error during login: ${error.response.data.message}`);
    }
  }

  return (
    <div className="p-12 max-w-md mx-auto">
      <h2 className="text-2xl text-center font-semibold mb-6">Login</h2>
      <form onSubmit={login}>
          <div className="grid grid-flow-col justify-stretch space-x-4">
              <FloatingLabel variant="filled" label="Username" name='username' type="text" id="username" onChange={(e) => setUsername(e.target.value)}/>
          </div>
          <div className="grid grid-flow-col mt-5 justify-stretch space-x-4">
              <FloatingLabel variant="filled" label="Password" name='password' type={showPassword?'text':'password'} id="password" onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className="flex items-center mb-4">
              <input onClick={()=>setShowPassword(!showPassword)} id="link-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="link-checkbox" className="ms-2 text-gray-300">Show password?</label>
          </div>
          <Button children='Login' />
      </form>
      <p className="mt-6 text-gray-500">Don't have an account yet? <a href='/register' className="text-blue-500 hover:text-blue-700">Register</a></p>
    </div>
  )
};

export default Login;