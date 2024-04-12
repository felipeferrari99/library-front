import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getBooks } from '../../requests/books';
import { TextInput, Pagination } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import Button from "../../components/Button";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [type, setType] = useState(null);
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const onPageChange = (page) => setCurrentPage(page);

  const fetchData = async () => {
    try {
      const response = await getBooks(search)
      setBooks(response);
      setTotalPages(Math.ceil(response.length / 3));
    } catch (error) {
      console.log(error)
    }
  }

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
    fetchData();
  }, [search]);

  const indexOfLastBook = currentPage * 3;
  const indexOfFirstBook = indexOfLastBook - 3;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  return (
    <div className="p-12">
      <h1 className="text-5xl text-center mb-8 mx-auto">BOOKS</h1>
      <TextInput className="mx-auto max-w-md" id="search" type="text" icon={HiSearch} placeholder="Search the name of a book!" onInput={(e) => setCurrentPage(1)} onChange={(e) => setSearch(e.target.value)} />
      <div className="flex flex-wrap justify-between">
        {books.length === 0 ? (
          <p className="text-center text-gray-500">No books found!</p>
        ) : (
          currentBooks.map((book) => (
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
      {books.length > 0 && (
          <Pagination
            layout="pagination"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            previousLabel="Back"
            showIcons
          />
      )}
        {type === 'admin' && (
          <div className="mt-5" >
            <Link to='/newbook'>
              <Button children="Create Book" />
            </Link>
          </div>
        )}
      </div>
      <style jsx="true">{`.book-image {width: 35vh; height: 53vh;}`}</style>
    </div>
  );
}