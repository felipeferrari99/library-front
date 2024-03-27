'use client';

import libraryFetch from '../../axios/config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FloatingLabel } from 'flowbite-react';
import Button from '../../components/Button';

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
      navigate(`/myRents`);
    } catch (error) {
      console.error('Error during book update:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex justify-between max-w-5xl mx-auto">
      <div className="w-1/2 p-5">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl mb-5">Renting: {book.title}</h2>
          <img className="w-60 h-90" src={book.image} alt={book.title}/>
          <div className="mt-5">
            <a href="/available" className="block mt-5 text-blue-500 hover:text-blue-700">Cancel</a>
          </div>
        </div>
      </div>
      <div className="w-1/2 p-5 mt-10">
        <form onSubmit={handleSubmit}>
            <div className="mt-7 mb-5">
              <FloatingLabel variant="filled" label="How many days do you want to rent this book for?" name='days' type="number" min={1} id="days" onChange={(e) => setDays(e.target.value)}/>
            </div>
            <Button children="Rent" />
        </form>
      </div>
    </div>
  );
};

export default NewRent;