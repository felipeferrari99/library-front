import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import { Link } from "react-router-dom";

import '../Books/Books.css';

export default function Authors() {
  const [authors, setAuthors] = useState([]);

  const getAuthors = async () => {
    try {
      const response = await libraryFetch.get("/authors")
      const data = response.data
      setAuthors(data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAuthors();
  }, []);

  return (
    <div className="divBooks">
      <h1>Authors</h1>
      <div className="books">
        {authors.length === 0 ? (<p>Loading...</p>) : (
          authors.map((author) => (
            <div className="book" key={author.id}>
               <Link to={`/authors/${author.id}`}>
                <h2>{author.name}</h2>
                <img src={author.image}/>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}