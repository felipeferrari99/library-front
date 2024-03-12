import libraryFetch from '../axios/config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';

import './Login.css'

const EditBook = () => {
  const [book, setBook] = useState(null);
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [image, setImage] = useState(null);
  const [qtyAvailable, setQtyAvailable] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await libraryFetch.get(`/books/${id}`)
        setBook(response.data.book);
      } catch (error) {
        console.error('Error fetching book data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setReleaseDate(book.release_date || '');
      setImage(null); 
      setQtyAvailable(book.qty_available.toString());
      setAuthor(book.authorName);
      setDescription(book.description);
    }
  }, [book]);

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
      await libraryFetch.put(`/books/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/books/${id}`);
    } catch (error) {
      console.error('Error during book update:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="login">
        <h2>Edit Book</h2>
        <form onSubmit={handleSubmit}>
            <div className="formControl">
                <label htmlFor='title'>Book Title</label>
                <input name='title' type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="formControl">
                <label htmlFor='author'>Author Name</label>
                <input name='author' type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div className="formControl">
              <label htmlFor="image">Add Image</label>
              <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <div className="formControl">
                <label htmlFor='description'>Description</label>
                <input name='description' type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="formControl">
                <label htmlFor='releaseDate'>Release Date</label>
                <input name='releaseDate' type="date" id="releaseDate" defaultValue={releaseDate ? moment(releaseDate).format('yyyy-MM-DD') : ''} onChange={(e) => setReleaseDate(e.target.value)} />
            </div>
            <div className="formControl">
                <label htmlFor='qtyAvailable'>Quantity Available</label>
                <input name='qtyAvailable' type="number" id="qtyAvailable" value={qtyAvailable} onChange={(e) => setQtyAvailable(e.target.value)} />
            </div>
            <input type="submit" value="Update Book" className="btn" />
        </form>
        <Link to={`/books/${id}`}>
            <a>Cancel</a>
        </Link>
    </div>
  )
}

export default EditBook;