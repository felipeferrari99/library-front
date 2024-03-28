'use client';

import libraryFetch from '../../axios/config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FloatingLabel } from 'flowbite-react';
import Button from '../../components/Button';
import { toast } from 'react-toastify';

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
        toast.error(`Error fetching user data: ${error.response.data.message}`);
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
        toast.success('Updated successfully!');
        navigate(`/user/${id}`);
    } catch (error) {
      toast.error(`Error during user update: ${error.response.data.message}`);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-2xl text-center font-semibold mb-6">Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="E-mail" name="email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Password" name="password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setPassword('')}/>
        </div>
        <Link to={`/user/${id}/image`}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-5">Change Image</button>
        </Link>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Description" name="description" type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)}/>
        </div>
        <Button children="Update User" />
      </form>
      <a href={`/user/${id}`} className="block mt-5 text-blue-500 hover:text-blue-700">Cancel</a>
    </div>
  );
};

export default EditUser;