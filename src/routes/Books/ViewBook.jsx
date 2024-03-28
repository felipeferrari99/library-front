'use client';

import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import { useParams, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import { FloatingLabel } from 'flowbite-react';
import Button from '../../components/Button';
import { toast } from 'react-toastify';

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
      toast.error(`Error fetching book data: ${error.response.data.message}`);
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
      toast.success('Book deleted!');
      navigate('/books');
    } catch (error) {
      toast.error(`Error deleting book: ${error.response.data.message}`);
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
      toast.success('Comment deleted!');
      getBook();
    } catch (error) {
      toast.error(`Error deleting comment: ${error.response.data.message}`);
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
      toast.success('Favorite book changed!');
      getBook();
    } catch (error) {
      toast.error(`Error changing favorite: ${error.response.data.message}`);
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
      toast.success(`Comment added!`);
      getBook();
      setBody('');
      setRating('');
    } catch (error) {
      toast.error(`Error adding comment: ${error.response.data.message}`);
    }
  };

  useEffect(() => {
    getBook();
  }, [id]);

  return (
    <div className="flex justify-between max-w-5xl mx-auto">
      <div className="w-1/2 p-5">
        {book === null ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col items-center">
            <img className="w-60 h-90 mb-5" src={book.book.image} alt={book.title} />
            <h1 className="text-3xl mb-2">{book.book.title}</h1>
            <Link to={`/authors/${book.book.author}`}>
              <h3 className="text-xl mb-5">{book.book.authorName}</h3>
            </Link>
            <p className="text-lg mb-5">{book.book.description}</p>
            <p className="text-lg">Released: {moment(book.book.release_date).format("DD/MM/YYYY")}</p>
            {type === 'admin' && (
              <p className="text-md mt-2">Quantity available: {book.book.qty_available}</p>
            )}
            {type === 'admin' && (
             <div className="mt-5 flex flex-col md:flex-row md:justify-start gap-2">
                <Link to={`/books/${id}/edit`}>
                  <Button children="Edit Book" />
                </Link>
                <button onClick={() => deleteBook(id)} className="p-2 pl-4 pr-4 rounded-2xl max-w-xs bg-white text-gray-800 border border-white hover:bg-red-700 hover:text-white transition-colors duration-300">
                  Delete Book
                </button>
              </div>
            )}
           {type == 'user' && (
              <div className="mt-5 flex flex-col md:flex-row md:justify-start gap-2">
                {favorite == id && (
                    <Button onClick={() => changeFavorite(id)} children="&#9733; Unfavorite?" />
                )}
                {favorite != id && (
                    <Button onClick={() => changeFavorite(id)} children="&#9734; Favorite!" />
                )}
                {book != null && book.book.qty_available > 0 && (
                    <Link to={`/newRent/${id}`}>
                      <Button children="Rent Book" />
                    </Link>
                )}
              </div>
            )}
            <a href="/books" className="mt-5 block text-blue-500 hover:text-blue-700">All Books</a>
          </div>
        )}
      </div>
      <div className="w-1/2 p-5">
        <div className="mb-5">
          <h2 className="text-3xl mb-2">Comments</h2>
        </div>
        {type === 'user' && (
          <div className="max-w-md mx-auto mb-5">
            <h3 className="text-xl mb-4">Leave a comment!</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <FloatingLabel className="rounded-lg" variant="filled" label="Rating" name="rating" type="number" id="rating" value={rating}  onChange={(e) => setRating(e.target.value)}/>
              <FloatingLabel className="rounded-lg" variant="filled" label="Comment" name="body" type="text" id="body" value={body} onChange={(e) => setBody(e.target.value)}/>
              <Button children="Post" />
            </form>
          </div>
        )}
        {book === null ? (<p></p>) : (
          <div className="flex flex-col gap-2">
            {book.comments.length === 0 ? (
              <p className="comment">No comments for this book yet!</p>
            ) : (
              book.comments.map((comment) => (
                <div className="border rounded-md p-2" key={comment.id}>
                  <Link to={`/user/${comment.user}`}>
                    <h4 className="block text-blue-500 hover:text-blue-700">{comment.username}</h4>
                    </Link>
                  <p className="text-xl mb-2">{comment.rating}</p>
                  <p className="mb-2">{comment.body}</p>
                  {userId == comment.user && (
                    <button onClick={() => deleteComment(comment.id)} className="p-2 rounded-2xl max-w-xs bg-white text-gray-800 border border-white hover:bg-red-700 hover:text-white transition-colors duration-300">
                      Delete Comment
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}