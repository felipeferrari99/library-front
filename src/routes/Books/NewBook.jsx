import libraryFetch from '../../axios/config';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

import '../Users/Login.css'

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
      navigate('/books');
    } catch (error) {
      console.error('Error during book creation:', error);
    }
  };  

  return (
    <div className="login">
        <h2>New Book</h2>
        <form onSubmit={handleSubmit}>
            <div className="formControl">
                <label htmlFor='title'>Book Title</label>
                <input name='title' type="text" id="title" onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="formControl">
                <label htmlFor='author'>Author Name</label>
                <input name='author' type="text" id="author" onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="formControl">
              <label htmlFor="image">Add Image</label>
              <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <div className="formControl">
                <label htmlFor='description'>Description</label>
                <input name='description' type="text" id="description" onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="formControl">
                <label htmlFor='releaseDate'>Release Date</label>
                <input name='releaseDate' type="date" id="releaseDate" onChange={(e) => setReleaseDate(e.target.value)} />
            </div>
            <div className="formControl">
                <label htmlFor='qtyAvailable'>Quantity Available</label>
                <input name='qtyAvailable' type="number" id="qtyAvailable" onChange={(e) => setQtyAvailable(e.target.value)} />
            </div>
            <input type="submit" value="Create Book" className="btn" />
        </form>
    </div>
  )
};

export default NewBook;