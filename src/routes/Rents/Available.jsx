import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import { Link } from "react-router-dom";

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
    <div>
      <h1 className="text-5xl text-center my-10">AVAILABLE BOOKS</h1>
      <div className="flex flex-wrap justify-between">
        {books.length === 0 ? (
          <p className="text-center text-gray-500">No books found!</p>
        ) : (
          books.map((book) => (
            <div className="w-full md:w-1/3 p-5 md:p-10 text-center mb-12 md:mb-0 cursor-pointer" key={book.id}>
              <Link to={`/newRent/${book.id}`}>
                <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
                <p className="text-gray-500 mb-2">{book.authorName}</p>
                <img className="book-image-30 mx-auto" src={book.image} alt={book.title} />
              </Link>
            </div>
          ))
        )}
      </div>
      <style jsx>{`.book-image-30 {width: 75%; height: auto;}`}</style>
    </div>
  )
}