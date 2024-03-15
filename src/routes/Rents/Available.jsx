import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import { Link } from "react-router-dom";

import '../Books/Books.css';

export default function Available() {
  const [books, setBooks] = useState([]);

  const getBooks = async () => {
    try {
      const response = await libraryFetch.get("/available")
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
      <h1>Available Books</h1>
      <div className="books">
        {books.length === 0 ? (<p>Loading...</p>) : (
          books.map((book) => (
            <div className="book" key={book.id}>
              <Link to={`/newRent/${book.id}`}>
                <h2>{book.title}</h2>
                <p>{book.authorName}</p>
                <img src={book.image}/>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}