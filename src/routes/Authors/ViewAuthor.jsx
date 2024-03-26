'use client';

import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import { useParams, useNavigate, Link } from 'react-router-dom';

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
      console.log(error)
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
      navigate('/authors');
    } catch (error) {
      console.log(error);
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
          <div className="flex justify-between mt-10">
              <Link to={`/authors/${id}/edit`}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Edit Author</button>
              </Link>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => deleteAuthor(id)}>
              Delete Author
            </button>
          </div>
        )}
        <Link to={'/authors'}>
          <a className="block mt-10 text-blue-500 hover:text-blue-700 text-center">
            Other Authors
          </a>
        </Link>
      </div>
    )}
  </div>
  )
}