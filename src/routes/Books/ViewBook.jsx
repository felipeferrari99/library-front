import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import { useParams, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';

export default function ViewBook() {
  const [book, setBook] = useState(null);
  const [type, setType] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const getBook = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setType(decodedToken.type)
      }
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

  return (
    <div>
        {book === null ? (<p>Loading...</p>) : (
            <div>
                <img style={{width: '15rem', height: '20rem'}} src={book.book.image} alt={book.title}/>
                <h1>{book.book.title}</h1>
                <Link to={`/authors/${book.book.author}`}>
                  <h3>{book.book.authorName}</h3>
                </Link>
                <p>{book.book.description}</p>
                <p>Released: {moment(book.book.release_date).format('DD/MM/YYYY')}</p>
            </div>
        )}
        {type == 'admin' && (
          <>
          <Link to={`/books/${id}/edit`}>
              <button>Edit Book</button>
          </Link>
          <Link to={`/books/${id}/image`}>
              <button>Change Image</button>
          </Link>
          <button onClick={() => deleteBook(id)}>Delete Book</button>
          </>
        )}
        <Link to={'/books'}>
            <a>All Books</a>
        </Link>
    </div>    
  )
}