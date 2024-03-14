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
        {author === null ? (<p>Loading...</p>) : (
            <div>
                <img style={{width: '15rem', height: '15rem'}} src={author.image} alt={author.name}/>
                <h1>{author.name}</h1>
                <p>{author.description}</p>
                <h2>Books:</h2>
                {books.map((book) => ( 
                    <div className="book" key={book.id}>
                      <Link to={`/books/${book.id}`}>
                          <h3>{book.title}</h3>
                          <img style={{width: '10rem', height: '15rem'}} src={book.image}/>
                      </Link>
                    </div>
                ))}
                {type == 'admin' && (
                  <>
                    <Link to={`/authors/${id}/edit`}>
                      <button>Edit Author</button>
                    </Link>
                    <Link to={`/authors/${id}/image`}>
                        <button>Change Image</button>
                    </Link>
                    <button onClick={() => deleteAuthor(id)}>Delete Author</button>
                  </>
                )}
                <Link to={'/authors'}>
                    <a>Other Authors</a>
                </Link>
            </div>
        )}
    </div>
  )
}