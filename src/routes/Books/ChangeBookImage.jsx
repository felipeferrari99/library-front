import libraryFetch from '../../axios/config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import '../Users/Login.css'

const ChangeBookImage = () => {
  const [book, setBook] = useState(null);
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
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
      setImage(null); 
    }
  }, [book]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      await libraryFetch.put(`/books/${id}/image`, formData, {
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
        <h2>Current image for: {book.title}</h2>
        <img style={{width: '15rem', height: '20rem'}} src={book.image} alt={book.title}/>
        <form onSubmit={handleSubmit}>
            <div className="formControl">
              <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <input type="submit" value="Change Image" className="btn" />
        </form>
        <Link to={`/books/${id}`}>
            <p>Cancel</p>
        </Link>
    </div>
  )
}

export default ChangeBookImage;