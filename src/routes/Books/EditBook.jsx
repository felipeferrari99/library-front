'use client';

import libraryFetch from '../../axios/config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import { FloatingLabel } from 'flowbite-react';
import Button from '../../components/Button';

const EditBook = () => {
  const [book, setBook] = useState(null);
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
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
      setQtyAvailable(book.qty_available);
      setAuthor(book.authorName);
      setDescription(book.description);
    }
  }, [book]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const token = localStorage.getItem('token');
        const response = await libraryFetch.put(`/books/${id}`, {
          title: title,
          author: author,
          description: description,
          release_date: moment(releaseDate).format('YYYY-MM-DD'),
          qty_available: qtyAvailable
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }});
        navigate(`/books/${id}`);
    } catch (error) {
      console.error('Error during book update:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-2xl text-center font-semibold mb-6">Edit Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Book Title" name="title" type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Author Name" name="author" type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)}/>
        </div>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Description" name="description" type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)}/>
        </div>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Release Date" name='releaseDate' type="date" id="releaseDate" defaultValue={releaseDate ? moment(releaseDate).format('yyyy-MM-DD') : ''} onChange={(e) => setReleaseDate(e.target.value)}/>
        </div>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Quantity Available" name='qtyAvailable' type="number" min={0} id="qtyAvailable" value={qtyAvailable} onChange={(e) => setQtyAvailable(e.target.value)}/>
        </div>
        <Button children="Update Book" />
      </form>
      <p className="text-blue-500 mt-5"><a href={`/books/${id}`}>Cancel</a></p>
    </div>
  );
};

export default EditBook;