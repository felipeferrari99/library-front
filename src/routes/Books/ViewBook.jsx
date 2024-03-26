'use client';

import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import { useParams, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import { FloatingLabel } from 'flowbite-react';
import Button from '../../components/Button';

export default function ViewBook() {
  const [book, setBook] = useState(null);
  const [type, setType] = useState('');
  const [favorite, setFavorite] = useState('');
  const [userId, setUserId] = useState('');
  const [body, setBody] = useState('');
  const [rating, setRating] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const getBook = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserId(decodedToken.userId);
        setType(decodedToken.type);
        const userResponse = await libraryFetch.get(`/user/${decodedToken.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
        }})
        const userData = userResponse.data;
        setFavorite(userData.user[0].favorite_book);
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

  const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        libraryFetch.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      await libraryFetch.delete(`/books/${id}/comments/${commentId}`);
      delete libraryFetch.defaults.headers.common["Authorization"];
      getBook();
    } catch (error) {
      console.log(error);
    }
  };

  const changeFavorite = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        libraryFetch.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      await libraryFetch.put(`/books/${id}/favorite/`);
      delete libraryFetch.defaults.headers.common["Authorization"];
      getBook();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await libraryFetch.post(`books/${id}/comments`, {
        body: body,
        rating: rating
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getBook();
      setBody('');
      setRating(null);
    } catch (error) {
      console.error('Error during book update:', error);
    }
  };

  useEffect(() => {
    getBook();
  }, [id]);

  return (
    <div className="flex justify-between view-book-container">
      <div className="view-book-left w-1/2">
        {book === null ? ( <p>Loading...</p> ) : (
          <div>
                <img style={{width: '15rem', height: '20rem'}} src={book.book.image} alt={book.title}/>
                <h1>{book.book.title}</h1>
                <Link to={`/authors/${book.book.author}`}>
                  <h3>{book.book.authorName}</h3>
                </Link>
                <p>{book.book.description}</p>
                <p>Released: {moment(book.book.release_date).format('DD/MM/YYYY')}</p>
                {type === 'admin' && (
                  <p>Quantity available: {book.book.qty_available}</p>
                )}
            </div>
        )
        }
        {type === 'admin' && (
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
        {type == 'user' && favorite == id && (
          <button onClick={() => changeFavorite(id)}>Unfavorite?</button>
        )}
        {type == 'user' && favorite != id && (
          <button onClick={() => changeFavorite(id)}>Favorite!</button>
        )}
        {book != null && type === 'user' && book.book.qty_available > 0 && (
            <Link to={`/newRent/${id}`}>
              <button>Rent Book</button>
            </Link>
        )}
        <Link to={'/books'}>
            <a>All Books</a>
        </Link>
        </div>
        <div className="w-1/2">
        <div className="mb-5">
          <h2 className="text-2xl">Comments</h2>
        </div>
        {type === 'user' && (
          <div className="p-10 max-w-md mx-auto">
            <h3>Leave a comment!</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="rating">Rating</label>
                <input name="rating" type="number" id="rating" onChange={(e) => setRating(e.target.value)} />
              </div>
              <div className="mb-5">
                <FloatingLabel variant="filled" label="Comment" name="body" type="text" id="body" onChange={(e) => setBody(e.target.value)}/>
              </div>
              <Button children="Post" />
            </form>
          </div>
        )}
        {book === null ? (
          <p></p>
        ) : (
          <div>
            {book.comments.length === 0 ? (
              <p className="comment">No comments for this book yet!</p>
            ) : (
              book.comments.map((comment) => (
                <div className="comment" key={comment.id}>
                  <Link to={`/user/${comment.user}`}>
                    <h5>{comment.username}</h5>
                  </Link>
                  <p>{comment.rating}</p>
                  <p>{comment.body}</p>
                  {userId == comment.user && (
                    <button onClick={() => deleteComment(comment.id)}>Delete Comment</button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>    
  )
}