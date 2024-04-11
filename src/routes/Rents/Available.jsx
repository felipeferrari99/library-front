import { useState, useEffect } from "react";
import { getBooks } from '../../requests/rents';
import { Link } from "react-router-dom";

export default function Available() {
  const [books, setBooks] = useState([]);

  const fetchData = async () => {
    try {
      const response = await getBooks()
      setBooks(response);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-12">
      <h1 className="text-5xl text-center mb-2 mx-auto">AVAILABLE BOOKS</h1>
      <div className="flex flex-wrap justify-between">
        {books.length === 0? (
          <p className="text-center text-gray-500">No books found!</p>
        ) : (
          books.map((book) => (
            <div className="w-full md:w-1/3 p-5 md:p-10 text-center mb-12 md:mb-0 cursor-pointer" key={book.id}>
              <Link to={`/newrent/${book.id}`} className="block">
                <h2 className="text-2xl font-bold mb-1">{book.title.slice(0, 30)}</h2>
                <p className="text-gray-500 mb-2">{book.authorName.slice(0, 30)}</p>
                <img className="book-image mx-auto" src={book.image} alt={book.title} />
              </Link>
            </div>
          ))
        )}
      </div>
      <style jsx="true">{`.book-image {width: 35vh; height: 53vh;}`}</style>
    </div>
  )
}