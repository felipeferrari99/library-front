import libraryFetch from '../../axios/config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import '../Users/Login.css'

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
        console.error('Error fetching author data:', error);
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
        navigate(`/authors/${id}`);
    } catch (error) {
      console.error('Error during author update:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="login">
        <h2>Edit Author</h2>
        <form onSubmit={handleSubmit}>
            <div className="formControl">
                <label htmlFor='name'>Author Name</label>
                <input name='name' type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="formControl">
                <label htmlFor='description'>Description</label>
                <input name='description' type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <input type="submit" value="Update Author" className="btn" />
        </form>
        <Link to={`/authors/${id}`}>
            <a>Cancel</a>
        </Link>
    </div>
  )
}

export default EditAuthor;