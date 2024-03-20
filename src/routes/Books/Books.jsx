import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import { Link } from "react-router-dom";

import './Books.css';

export default function Books() {
  const [books, setBooks] = useState([]);

  const getBooks = async () => {
    try {
      const response = await libraryFetch.get("/books")
      const data = response.data
      setBooks(data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="divBooks">
      <h1>Books</h1>
      <div className="books">
        {books.length === 0 ? (<p>No books found!</p>) : (
          books.map((book) => (
            <div className="book" key={book.id}>
              <Link to={`/books/${book.id}`}>
                <h2>{book.title}</h2>
              </Link>
              <Link to={`/authors/${book.author}`}>
                <p>{book.authorName}</p>
              </Link>
              <Link to={`/books/${book.id}`}>
                <img src={book.image}/>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}