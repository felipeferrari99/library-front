import libraryFetch from '../../axios/config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import '../Users/Login.css'

const EditUser = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await libraryFetch.get(`/user/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
        }})
        setUser(response.data.user[0]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [id]);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setPassword(user.password);
      setDescription(user.description);
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const token = localStorage.getItem('token');
        await libraryFetch.put(`/user/${id}`, {
          email: email,
          password: password,
          description: description
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }});
        navigate(`/user/${id}`);
    } catch (error) {
      console.error('Error during user update:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="login">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
            <div className="formControl">
                <label htmlFor='email'>E-mail</label>
                <input name='email' type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="formControl">
                <label htmlFor='password'>Password</label>
                <input name='password' type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setPassword('')}/>
            </div>
            <div className="formControl">
                <label htmlFor='description'>Description</label>
                <input name='description' type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <input type="submit" value="Update User" className="btn" />
        </form>
        <Link to={`/user/${id}`}>
            <a>Cancel</a>
        </Link>
    </div>
  )
}

export default EditUser;