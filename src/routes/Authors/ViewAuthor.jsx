'use client';

import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../../components/Button';
import { toast } from 'react-toastify';

export default function ViewAuthor() {
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState(null);
  const [type, setType] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const getAuthor = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setType(decodedToken.type)
      }
      const response = await libraryFetch.get(`/authors/${id}`)
      const data = response.data
      setAuthor(data.author[0]);
      setBooks(data.books)
    } catch (error) {
      toast.error(`Error fetching author data: ${error.response.data.message}`);
    }
  }

  const deleteAuthor = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        libraryFetch.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      await libraryFetch.delete(`/authors/${id}`);
      delete libraryFetch.defaults.headers.common["Authorization"];
      toast.success('Author deleted!');
      navigate('/authors');
    } catch (error) {
      toast.error(`Error deleting author: ${error.response.data.message}`);
    }
  };

  useEffect(() => {
    getAuthor();
  }, [id]);

  return (
    <div>
    {author === null ? (
      <p>Loading...</p>
    ) : (
      <div className="flex flex-col items-center">
        <img
          className="w-64 h-64"
          src={author.image}
          alt={author.name}
        />
        <h1 className="text-3xl text-center mt-5">{author.name}</h1>
        <p className="text-center max-w-xl mt-3">{author.description}</p>
        <h2 className="text-2xl text-center mt-10">Books:</h2>
        {books.length === 0 ? (
          <p className="text-center text-gray-500">No books found!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
            {books.map((book) => (
              <div key={book.id} className="flex flex-col items-center">
                <Link to={`/books/${book.id}`}>
                  <img src={book.image} alt={book.title} className="w-60 h-90 object-cover mb-2" />
                  <h2 className="text-2xl text-center">{book.title}</h2>
                </Link>
              </div>
            ))}
          </div>
        )}
        {type == 'admin' && (
          <div className="mt-10 flex flex-col md:flex-row md:justify-start gap-2">
              <Link to={`/authors/${id}/edit`}>
                <Button children="Edit Author" />
            </Link>
            <button onClick={() => deleteAuthor(id)} className="p-2 rounded-2xl max-w-xs bg-white text-gray-800 border border-white hover:bg-red-700 hover:text-white transition-colors duration-300">Delete Author</button>
          </div>
        )}
        <a href="/authors" className="block mt-5 text-blue-500 hover:text-blue-700 text-center">Other Authors</a>
      </div>
    )}
  </div>
  )
}