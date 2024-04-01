'use client';

import libraryFetch from '../../axios/config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { FloatingLabel, FileInput, Modal } from 'flowbite-react';
import Button from '../../components/Button';
import { toast } from 'react-toastify';

const EditUser = () => {
  const [, setLoginState] = useOutletContext();
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState('');
  const { id } = useParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await libraryFetch.get(`/user/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
        }})
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setUserId(decodedToken.userId);
        }
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
    if (user && userId == id) {
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

  const handleImageSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('image', image);
    try {
      const oldToken = localStorage.getItem('token');
      const response = await libraryFetch.put(`/user/${id}/image`, formData, {
        headers: {
          Authorization: `Bearer ${oldToken}`,
        },
      });
      const { token } = response.data;
      localStorage.removeItem('token');
      localStorage.setItem('token', token);
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setLoginState({ isLoggedIn: true, isAdmin: decodedToken.type === 'admin', image: decodedToken.image, id: decodedToken.userId, username: username });
      window.location.reload();
    } catch (error) {
      console.error('Error during user update:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      {userId != id ? (
        navigate(`/user/${id}`)
      ) : (
        <div>
        <h2 className="text-2xl text-center font-semibold mb-6">Edit User</h2>
        <button onClick={() => setOpenModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-5">Change Image</button>
          <Modal dismissible show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
            <Modal.Header className="bg-gray-900" />
            <Modal.Body className="bg-gray-900">
              <div className="text-center">
                <h2 className='mb-3'>Current image for: {user.username}</h2>
                <img
                  style={{ marginLeft: '4rem', width: '15rem', height: '15rem', borderRadius: '50%' }}
                  src={user.image}
                  alt={user.username}
                />
                <form onSubmit={handleImageSubmit}>
                  <FileInput className='mt-5 mb-5' id="image" onChange={(e) => setImage(e.target.files[0])} />
                  <div className="flex justify-center gap-4">
                    <Button type="submit" children="Update" />
                    <Button children='Cancel' onClick={() => setOpenModal(false)} />
                  </div>
                </form>
              </div>
            </Modal.Body>
          </Modal>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <FloatingLabel variant="filled" label="E-mail" name="email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="mb-5">
            <FloatingLabel variant="filled" label="Password" name="password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setPassword('')}/>
          </div>
          <div className="mb-5">
            <FloatingLabel variant="filled" label="Description" name="description" type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)}/>
          </div>
          <Button children="Update User" />
        </form>
        <a href={`/user/${id}`} className="block mt-5 text-blue-500 hover:text-blue-700">Cancel</a>
        </div>
      )}
    </div>
  );
};

export default EditUser;