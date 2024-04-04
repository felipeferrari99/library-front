'use client';

import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import { useParams, useNavigate, Link } from 'react-router-dom';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import { Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ViewAuthor() {
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState(null);
  const [type, setType] = useState('');
  const [openModal, setOpenModal] = useState(false);
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
      toast.error(`Error fetching author data: ${error.response.data.message}`);
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
      toast.success('Author deleted!');
      navigate('/authors');
    } catch (error) {
      toast.error(`Error deleting author: ${error.response.data.message}`);
    }
  };

  useEffect(() => {
    getAuthor();
  }, [id]);

  return (
    <div className="p-10">
    {author === null ? (
      <p>Loading...</p>
    ) : (
      <div className="flex flex-col items-center">
        <img
          className="w-64 h-64"
          src={author.image}
          alt={author.name}
        />
        <h1 className="text-3xl text-center mt-5">{author.name}</h1>
        <p className="text-center max-w-xl mt-3">{author.description}</p>
        <h2 className="text-2xl text-center mt-10">Books:</h2>
        {books.length === 0 ? (
          <p className="text-center text-gray-500">No books found!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-7">
            {books.map((book) => (
              <div key={book.id} className="flex flex-col items-center mb-5">
                <Link to={`/books/${book.id}`}>
                  <h2 className="text-xl text-center mb-2">{book.title}</h2>
                  <img src={book.image} alt={book.title} style={{width: '65%', height: 'auto'}} className="mx-auto" />
                </Link>
              </div>
            ))}
          </div>
        )}
        {type == 'admin' && (
          <div className="mt-10 flex flex-col md:flex-row md:justify-start gap-2">
              <Link to={`/authors/${id}/edit`}>
                <Button children="Edit Author" />
            </Link>
            <button onClick={() => setOpenModal(true)} className="p-2 rounded-2xl max-w-xs bg-white text-gray-800 border border-white hover:bg-red-700 hover:text-white transition-colors duration-300">Delete Author</button>
            <Modal dismissible show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
              <Modal.Header className="bg-gray-900" />
              <Modal.Body className="bg-gray-900">
                <div className="text-center">
                  <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                  <h3 className="mb-5 text-lg font-normal text-gray-300 dark:text-gray-400">
                    Are you sure you want to delete this author?
                  </h3>
                  <div className="flex justify-center gap-4">
                    <button onClick={() => deleteAuthor(id)} className="p-2 rounded-2xl max-w-xs bg-white text-gray-800 border border-white hover:bg-red-700 hover:text-white transition-colors duration-300">Delete Author</button>
                    <Button children='Cancel' onClick={() => setOpenModal(false)} />
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        )}
        <a href="/authors" className="block mt-5 text-blue-500 hover:text-blue-700 text-center">Other Authors</a>
      </div>
    )}
  </div>
  )
}