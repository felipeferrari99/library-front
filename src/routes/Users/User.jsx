import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import { useParams, Link } from 'react-router-dom';

export default function User() {
  const [user, setUser] = useState(null);
  const [book, setBook] = useState(null);
  const [userId, setUserId] = useState('');
  const { id } = useParams();

  const getUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await libraryFetch.get(`/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
      }})
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserId(decodedToken.userId)
      }
      const data = response.data;
      setUser(data.user[0]);
      setBook(data.book)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUser();
  }, [id]);

  return (
    <div>
        {user === null ? (<p>Loading...</p>) : (
            <div>
                <img style={{width: '15rem', height: '15rem', borderRadius: '50%' }} src={user.image} alt={user.username}/>
                <h1>{user.username}</h1>
                <p>{user.description}</p>
                {book.length !== 0 && (
                    <div>
                        <h2>Favorite Book:</h2>
                        <div className="book">
                            <Link to={`/books/${book[0].favorite_book}`}>
                                <h3>{book[0].title}</h3>
                                <img style={{width: '10rem', height: '15rem'}} src={book[0].image}/>
                            </Link>
                        </div>
                    </div>
                )}
                {userId == id && (
                    <>
                    <Link to={`/user/${id}/edit`}>
                        <button>Edit User</button>
                    </Link>
                    <Link to={`/user/${id}/image`}>
                        <button>Change Image</button>
                    </Link>
                    </>
                )}
            </div>
        )}
    </div>
  )
}