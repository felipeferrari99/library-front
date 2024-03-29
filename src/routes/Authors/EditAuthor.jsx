'use client';

import libraryFetch from '../../axios/config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FloatingLabel } from 'flowbite-react';
import Button from '../../components/Button';
import { toast } from 'react-toastify';

const EditAuthor = () => {
  const [author, setAuthor] = useState(null);
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await libraryFetch.get(`/authors/${id}`)
        setAuthor(response.data.author[0]);
      } catch (error) {
        toast.error(`Error fetching author data: ${error.response.data.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  useEffect(() => {
    if (author) {
      setName(author.name);
      setDescription(author.description);
    }
  }, [author]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const token = localStorage.getItem('token');
        await libraryFetch.put(`/authors/${id}`, {
          name: name,
          description: description
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }});
        toast.success('Author updated successfully!');
        navigate(`/authors/${id}`);
    } catch (error) {
      toast.error(`Error during author update: ${error.response.data.message}`);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-2xl text-center font-semibold mb-6">Edit Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Author Name" name="name" type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}/>
        </div>
        <Link to={`/authors/${id}/image`}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-5">Change Image</button>
        </Link>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Description" name="description" type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)}/>
        </div>
        <Button children="Update Author" />
      </form>
      <a href={`/authors/${id}`} className="block mt-5 text-blue-500 hover:text-blue-700">Cancel</a>
    </div>
  );
};

export default EditAuthor;