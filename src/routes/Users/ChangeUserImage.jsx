import libraryFetch from '../../axios/config';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext, Link } from 'react-router-dom';

const ChangeUserImage = () => {
  const [, setLoginState] = useOutletContext();
  const [user, setUser] = useState(null);
  const { id } = useParams();
  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await libraryFetch.get(`/user/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
        }})
        setUser(response.data.user[0]);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [id]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setImage(null); 
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('image', image);

    try {
      const oldToken = localStorage.getItem('token');
      const response = await libraryFetch.put(`/user/${id}/image`, formData, {
        headers: {
          Authorization: `Bearer ${oldToken}`,
        },
      });
      const { token } = response.data;

      localStorage.removeItem('token');
      localStorage.setItem('token', token);

      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      setLoginState({ isLoggedIn: true, isAdmin: decodedToken.type === 'admin', image: decodedToken.image, id: decodedToken.userId, username: username });

      navigate(`/user/${id}`);
    } catch (error) {
      console.error('Error during user update:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="login">
        <h2>Current image for: {user.username}</h2>
        <img style={{width: '15rem', height: '15rem'}} src={user.image} alt={user.username}/>
        <form onSubmit={handleSubmit}>
            <div className="formControl">
              <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <input type="submit" value="Change Image" className="btn" />
        </form>
        <Link to={`/user/${id}`}>
            <p>Cancel</p>
        </Link>
    </div>
  )
}

export default ChangeUserImage;