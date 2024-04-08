import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import "flowbite-react";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [type, setType] = useState(null);

  const getBooks = async () => {
    try {
      const response = await libraryFetch.get("/books");
      const data = response.data;
      setBooks(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getToken = () => {
      const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setType(decodedToken.type);
        } 
    };
    getToken();
  });

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="p-12">
      <h1 className="text-5xl text-center mb-2 mx-auto">BOOKS</h1>
      <div className="flex flex-wrap justify-between">
        {books.length === 0? (
          <p className="text-center text-gray-500">No books found!</p>
        ) : (
          books.map((book) => (
            <div className="w-full md:w-1/3 p-5 md:p-10 text-center mb-12 md:mb-0 cursor-pointer" key={book.id}>
              <Link to={`/books/${book.id}`} className="block">
                <h2 className="text-2xl font-bold mb-1">{book.title.slice(0, 30)}</h2>
              </Link>
              <Link to={`/authors/${book.author}`} className="block">
                <p className="text-gray-500 mb-2">{book.authorName.slice(0, 30)}</p>
              </Link>
              <Link to={`/books/${book.id}`}>
                <img className="book-image mx-auto" src={book.image} alt={book.title} />
              </Link>
            </div>
          ))
        )}
      </div>
      <div className="text-center">
        {type === 'admin' && (
          <Link to='/newbook'>
            <Button children="Create Book" />
          </Link>
        )}
      </div>
      <style jsx="true">{`.book-image {width: 35vh; height: 53vh;}`}</style>
    </div>
  );
}