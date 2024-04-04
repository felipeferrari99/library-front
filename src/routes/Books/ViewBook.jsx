'use client';

import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import { useParams, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import { FloatingLabel, Modal } from 'flowbite-react';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Stars from 'react-stars';

export default function ViewBook() {
  const [book, setBook] = useState(null);
  const [type, setType] = useState('');
  const [favorite, setFavorite] = useState('');
  const [userId, setUserId] = useState('');
  const [body, setBody] = useState('');
  const [starRating, setStarRating] = useState(1);
  const [openModal, setOpenModal] = useState(false);
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

  const unloggedFavorite = () => {
    toast.error('Log in to add this book to your favorites!')
  }

  const unloggedRent = () => {
    toast.error('Log in to rent this book!')
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await libraryFetch.post(`books/${id}/comments`, {
        body: body,
        rating: starRating,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(`Comment added!`);
      getBook();
      setBody('');
      setStarRating(1);
    } catch (error) {
      toast.error(`Error adding comment: ${error.response.data.message}`);
    }
  };

  useEffect(() => {
    getBook();
  }, [id]);

  return (
    <div className="flex justify-between p-10 max-w-5xl mx-auto">
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
            <p className="text-lg">Released: {moment.utc(book.book.release_date).format("DD/MM/YYYY")}</p>
            {type === 'admin' && (
              <p className="text-md mt-2">Quantity available: {book.book.qty_available}</p>
            )}
            {type === 'admin' && (
             <div className="mt-5 flex flex-col md:flex-row md:justify-start gap-2">
                <Link to={`/books/${id}/edit`}>
                  <Button children="Edit Book" />
                </Link>
                <button onClick={() => setOpenModal(true)} className="p-2 pl-4 pr-4 rounded-2xl max-w-xs bg-white text-gray-800 border border-white hover:bg-red-700 hover:text-white transition-colors duration-300">
                  Delete Book
                </button>
                <Modal dismissible show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
                  <Modal.Header className="bg-gray-900" />
                  <Modal.Body className="bg-gray-900">
                    <div className="text-center">
                      <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                      <h3 className="mb-5 text-lg font-normal text-gray-300 dark:text-gray-400">
                        Are you sure you want to delete this book?
                      </h3>
                      <div className="flex justify-center gap-4">
                        <button onClick={() => deleteBook(id)} className="p-2 rounded-2xl max-w-xs bg-white text-gray-800 border border-white hover:bg-red-700 hover:text-white transition-colors duration-300">Delete Book</button>
                        <Button children='Cancel' onClick={() => setOpenModal(false)} />
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
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
                    <Link to={`/newrent/${id}`}>
                      <Button children="Rent Book" />
                    </Link>
                )}
              </div>
            )}
            {!type && (
              <div className="mt-5 flex flex-col md:flex-row md:justify-start gap-2">
                  <Button onClick={unloggedFavorite} children="&#9734; Favorite!" />
                  {book != null && book.book.qty_available > 0 && (
                  <Button onClick={unloggedRent} children="Rent Book" />
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
        {!type && (
          <h3 className="text-xl mb-5"><a href='/login' className="text-blue-500 hover:text-blue-700">Log in</a> to leave a comment!</h3>
        )}
        {type === 'user' && (
          <div className="max-w-md mx-auto mb-5">
            <h3 className="text-xl">Leave a comment!</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <Stars
                count={5}
                value={starRating || 1}
                onChange={setStarRating}
                size={30}
                color2={'#ffd700'}
                color1={'#a9a9a9'}
                half={false}
              />
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
                    <Stars
                    count={5}
                    value={comment.rating}
                    size={20}
                    color2={'#ffd700'}
                    color1={'#a9a9a9'}
                    edit={false}
                  />
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