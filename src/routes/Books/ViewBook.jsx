import { useState, useEffect } from "react";
import { getBook, deleteBook } from '../../requests/books';
import { newComment, deleteComment } from "../../requests/comments";
import { getUser, alterFavorite } from '../../requests/users';
import { useParams, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import { FloatingLabel, Modal, Pagination } from 'flowbite-react';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Stars from 'react-stars';

export default function ViewBook() {
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [type, setType] = useState('');
  const [favorite, setFavorite] = useState('');
  const [userId, setUserId] = useState('');
  const [body, setBody] = useState('');
  const [starRating, setStarRating] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const onPageChange = (page) => setCurrentPage(page);
  const [openModal, setOpenModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserId(decodedToken.userId);
        setType(decodedToken.type);
        const userData = await getUser(decodedToken.userId);
        setFavorite(userData.user[0].favorite_book);
      }
      const response = await getBook(id)
      setBook(response)
      setComments(response.comments)
      setTotalPages(Math.ceil(response.comments.length / 3));
    } catch (error) {
      toast.error(`Error fetching author data: ${error.response.data.message}`);
    }
  }

  const removeBook = async (id) => {
    try {
      await deleteBook(id);
      toast.success('Book deleted!');
      navigate('/books');
    } catch (error) {
      toast.error(`Error deleting book: ${error.response.data.message}`);
    }
  };

  const removeComment = async (commentId) => {
    try {
      await deleteComment(id, commentId);
      toast.success('Comment deleted!');
      if (currentComments.length === 1) {
        setCurrentPage(currentPage - 1)
      }
      fetchData();
    } catch (error) {
      toast.error(`Error deleting comment: ${error.response.data.message}`);
    }
  };

  const changeFavorite = async (id) => {
    try {
      await alterFavorite(id);
      toast.success('Favorite book changed!');
      fetchData();
    } catch (error) {
      toast.error(`Error changing favorite: ${error.message}`);
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
      await newComment(id, body, starRating)
      toast.success(`Comment added!`);
      fetchData();
      setBody('');
      setStarRating(1);
    } catch (error) {
      toast.error(`Error adding comment: ${error.response.data.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const indexOfLastComment = currentPage * 3;
  const indexOfFirstComment = indexOfLastComment - 3;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
  return (
    <div className="flex flex-col lg:flex-row justify-between p-10 max-w-5xl mx-auto">
      <div className="w-full lg:w-1/2 p-5">
        {book === null ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col items-center">
            <img
              style={{ width: "35vh", height: "53vh" }}
              className="mb-5"
              src={book.book.image}
              alt={book.title}
            />
            <h1 className="text-3xl mb-2">{book.book.title.slice(0, 30)}</h1>
            <Link to={`/authors/${book.book.author}`}>
              <h3 className="text-xl mb-5">{book.book.authorName.slice(0, 30)}</h3>
            </Link>
            <p className="text-lg mb-5">{book.book.description}</p>
            <p className="text-lg">Released: {moment.utc(book.book.release_date).format("DD/MM/YYYY")}</p>
            {type === "admin" && (
              <p className="text-md mt-2">Quantity available: {book.book.qty_available}</p>
            )}
            {type === "admin" && (
              <div className="mt-5 flex flex-col md:flex-row md:justify-start gap-2">
                <Link to={`/books/${book.book.id}/edit`}>
                  <Button className="w-full md:w-auto" children="Edit Book"/>
                </Link>
                <button onClick={() => setOpenModal(true)} className="p-2 pl-4 pr-4 rounded-2xl max-w-xs bg-white text-gray-800 border border-white hover:bg-red-700 hover:text-white transition-colors duration-300">
                  Delete Book
                </button>
                <Modal show={openModal} size="md" popup={true} onClose={() => setOpenModal(false)}>
                <Modal.Header className="bg-gray-900" />
                  <Modal.Body className="bg-gray-900">
                    <div className="text-center">
                      <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                      <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                        Are you sure you want to delete this book?
                      </h3>
                      <div className="flex justify-center gap-4">
                        <button onClick={() => removeBook(book.book.id)} className="p-2 pl-4 pr-4 rounded-2xl max-w-xs bg-white text-gray-800 border border-white hover:bg-red-700 hover:text-white transition-colors duration-300">
                          Delete Book
                        </button>
                        <Button onClick={() => setOpenModal(false)} children='Cancel' />
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
            )}
            {type == "user" && (
              <div className="mt-5 flex flex-col md:flex-row md:justify-start gap-2">
                {favorite == book.book.id && (
                  <Button onClick={() => changeFavorite(book.book.id)} children='&#9733; Unfavorite' />
                )}
                {favorite != book.book.id && (
                  <Button onClick={() => changeFavorite(book.book.id)} children='&#9734; Favorite' />
                )}
                {book != null && book.book.qty_available > 0 && (
                  <Link to={`/newrent/${book.book.id}`}>
                    <Button children='Rent Book' />
                  </Link>
                )}
              </div>
            )}
            {!type && (
              <div className="mt-5 flex flex-col md:flex-row md:justify-start gap-2">
                <Button onClick={() => unloggedFavorite()} children='&#9734; Favorite' />
                {book != null && book.book.qty_available > 0 && (
                  <Button onClick={() => unloggedRent()} children='Rent Book' />
                )}
              </div>
            )}
            <a href="/books" className="mt-5 block text-blue-500 hover:text-blue-700">All Books</a>
          </div>
        )}
      </div>
      <div className="w-full lg:w-1/2 p-5 comments-section">
        <div className="mb-5">
          <h2 className="text-3xl mb-2">Comments</h2>
        </div>
        {!type && (
          <h3 className="text-xl mb-5">
            <a href="/login" className="text-blue-500 hover:text-blue-700">Log in</a>{" "}to leave a comment!
          </h3>
        )}
        {type === "user" && (
          <div className="max-w-md mx-auto mb-5">
            <h3 className="text-xl">Leave a comment!</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <Stars
                count={5}
                value={starRating}
                onChange={setStarRating}
                size={30}
                color2={"#ffd700"}
                color1={"#a9a9a9"}
                half={false}
              />
              <FloatingLabel
                label="Comment"
                name="body"
                type="text"
                id="body"
                className="rounded-lg"
                variant="filled"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <Button children='Post' />
            </form>
          </div>
        )}
        {book === null ? (
          <p></p>
        ) : (
          <div className="flex flex-col gap-2">
            {book.comments.length === 0 ? (
              <p className="comment">No comments for this book yet!</p>
            ) : (
              currentComments.map((comment) => (
                <div className="border rounded-md p-2" key={comment.id}>
                  <Link to={`/user/${comment.user}`}>
                    <h4 className="block text-blue-500 hover:text-blue-700">
                      {comment.username}
                    </h4>
                  </Link>
                  <Stars
                    count={5}
                    value={comment.rating}
                    size={20}
                    color2={"#ffd700"}
                    color1={"#a9a9a9"}
                    edit={false}
                  />
                  <p className="mb-2">{comment.body}</p>
                  {userId == comment.user && (
                    <button
                      onClick={() => removeComment(comment.id)}
                      className="p-2 rounded-2xl max-w-xs bg-white text-gray-800 border border-white hover:bg-red-700 hover:text-white transition-colors duration-300"
                    >
                      Delete Comment
                    </button>
                  )}
                </div>
                
              ))
            )}
            {comments.length > 3 && (
              <Pagination
                layout="pagination"
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                previousLabel="Back"
                showIcons
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};