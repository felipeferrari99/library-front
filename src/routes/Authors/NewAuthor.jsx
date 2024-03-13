import libraryFetch from '../../axios/config';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../Users/Login.css'

const NewAuthor = () => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('description', description);
  
    try {
      const token = localStorage.getItem('token');
      const response = await libraryFetch.post('/authors', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/authors');
    } catch (error) {
      console.error('Error during author creation:', error);
    }
  };  

  return (
    <div className="login">
        <h2>New Author</h2>
        <form onSubmit={handleSubmit}>
            <div className="formControl">
                <label htmlFor='name'>Author Name</label>
                <input name='name' type="text" id="name" onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="formControl">
              <label htmlFor="image">Add Image</label>
              <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <div className="formControl">
                <label htmlFor='description'>Description</label>
                <input name='description' type="text" id="description" onChange={(e) => setDescription(e.target.value)} />
            </div>
            <input type="submit" value="Create Author" className="btn" />
        </form>
    </div>
  )
};

export default NewAuthor;