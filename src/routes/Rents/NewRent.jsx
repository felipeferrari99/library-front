import libraryFetch from '../../axios/config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import '../Users/Login.css'

const NewRent = () => {
  const [book, setBook] = useState(null);
  const { id } = useParams();
  const [days, setDays] = useState('');
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await libraryFetch.post(`/${id}/rent`, {
        daysRented: days
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate(`/available`);
    } catch (error) {
      console.error('Error during book update:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="login">
        <h2>Renting: {book.title}</h2>
        <img style={{width: '15rem', height: '20rem'}} src={book.image} alt={book.title}/>
        <form onSubmit={handleSubmit}>
            <div className="formControl">
                <label htmlFor='days'>How many days do you want to rent this book for?</label>
                <input id='days' type="number" onChange={(e) => setDays(e.target.value)} />
            </div>
            <input type="submit" value="Rent" className="btn" />
        </form>
        <Link to={`/available`}>
            <p>Available Books</p>
        </Link>
        <Link to={'/books'}>
            <a>All Books</a>
        </Link>
    </div>
  )
}

export default NewRent;