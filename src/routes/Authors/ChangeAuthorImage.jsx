import libraryFetch from '../../axios/config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ChangeAuthorImage = () => {
  const [author, setAuthor] = useState(null);
  const { id } = useParams();
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
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
      setImage(null); 
    }
  }, [author]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);

    try {
      const token = localStorage.getItem('token');
      await libraryFetch.put(`/authors/${id}/image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
        <h2>Current image for: {author.name}</h2>
        <img style={{width: '15rem', height: '15rem'}} src={author.image} alt={author.name}/>
        <form onSubmit={handleSubmit}>
            <div className="formControl">
              <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <input type="submit" value="Change Image" className="btn" />
        </form>
        <Link to={`/authors/${id}`}>
            <p>Cancel</p>
        </Link>
    </div>
  )
}

export default ChangeAuthorImage;