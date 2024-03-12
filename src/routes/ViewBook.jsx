import { useState, useEffect } from "react";
import libraryFetch from "../axios/config";
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function ViewBook() {
  const [book, setBook] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const getBook = async () => {
    try {
      const response = await libraryFetch.get(`/books/${id}`)
      const data = response.data
      setBook(data);
    } catch (error) {
      console.log(error)
    }
  }

  const deleteBook = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        libraryFetch.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      await libraryFetch.delete(`/books/${id}`);
      delete libraryFetch.defaults.headers.common["Authorization"];
      navigate('/books');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBook();
  }, [id]);

  useEffect(() => {
  }, [book]);

  return (
    <div>
        {book === null ? (<p>Loading...</p>) : (
            <div>
                <img style={{width: '15rem', height: '20rem'}} src={book.book.image} alt={book.title}/>
                <h1>{book.book.title}</h1>
                <h2>{book.book.authorName}</h2>
                <p>{book.book.description}</p>
            </div>
        )}
        <Link to={`/books/${id}/edit`}>
            <button>Edit Book</button>
        </Link>
        <button onClick={() => deleteBook(id)}>Delete Book</button>
        <Link to={'/books/'}>
            <a>All Books</a>
        </Link>
    </div>    
  )
}