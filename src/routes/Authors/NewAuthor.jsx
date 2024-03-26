'use client';

import libraryFetch from '../../axios/config';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FloatingLabel, FileInput, Label } from 'flowbite-react';
import Button from '../../components/Button';

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
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-2xl text-center font-semibold mb-6">New Author</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Author Name" name="name" type="text" id="name" onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className='mb-5'>
          <div className="mb-2 block">
              <Label className='text-white' htmlFor="image" value="Add Image" />
          </div>
            <FileInput id="image" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Description" name="description" type="text" id="description" onChange={(e) => setDescription(e.target.value)}/>
        </div>
        <Button children="Create Author" />
      </form>
    </div>
  )
};

export default NewAuthor;