'use client';

import libraryFetch from '../../axios/config';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { FloatingLabel, FileInput, Label } from 'flowbite-react';
import Button from '../../components/Button';
import { toast } from 'react-toastify';

const NewBook = () => {
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [image, setImage] = useState(null);
  const [qtyAvailable, setQtyAvailable] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('image', image);
    formData.append('description', description);
    formData.append('release_date', moment(releaseDate).format('YYYY-MM-DD'));
    formData.append('qty_available', qtyAvailable);
  
    try {
      const token = localStorage.getItem('token');
      const response = await libraryFetch.post('/books', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Book created successfully!');
      navigate('/books');
    } catch (error) {
      toast.error(`Error during book creation: ${error.response.data.message}`);
    }
  };  

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-2xl text-center font-semibold mb-6">New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Book Title" name="title" type="text" id="title" onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Author Name" name="author" type="text" id="author" onChange={(e) => setAuthor(e.target.value)}/>
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
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Release Date" name='releaseDate' type="date" id="releaseDate" onChange={(e) => setReleaseDate(e.target.value)}/>
        </div>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Quantity Available" name='qtyAvailable' type="number" id="qtyAvailable" onChange={(e) => setQtyAvailable(e.target.value)}/>
        </div>
        <Button children="Create Book" />
      </form>
    </div>
  )
};

export default NewBook;