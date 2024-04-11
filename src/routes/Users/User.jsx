import { Link, useParams } from 'react-router-dom';
import { getUser } from '../../requests/users';
import { useState, useEffect } from 'react';
import Button from '../../components/Button';

function FavoriteBook({ book }) {
  return (
    <div className="text-center">
      <Link to={`/books/${book.favorite_book}`}>
        <h3 className="text-xl font-bold mb-2">{book.title.slice(0, 30)}</h3>
        <img style={{ width: '10rem', height: '15rem' }} src={book.image} alt={book.title} />
      </Link>
    </div>
  );
}

export default function User() {
  const [user, setUser] = useState(null);
  const [book, setBook] = useState(null);
  const [userId, setUserId] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUserId(decodedToken.userId);
      }
      const data = await getUser(id);
      setUser(data.user[0]);
      setBook(data.book);
    }
    fetchData();
  })

  return (
    <div className="flex flex-col p-8 items-center">
      {user === null ? (
        <p>Loading...</p>
      ) : (
        <>
          <img
            style={{ width: '15rem', height: '15rem', borderRadius: '50%' }}
            src={user.image}
            alt={user.username}
          />
          <h1 className="text-2xl font-bold mt-3">{user.username}</h1>
          <p className="text-center max-w-xl mt-3">{user.description}</p>

          {book && book.length !== 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-2">Favorite Book:</h2>
              <FavoriteBook key={book[0].favorite_book} book={book[0]} />
            </div>
          )}

          {userId == id && (
            <div className="mt-8">
              <Link to={`/user/${id}/edit`}>
                <Button children='Edit User'/>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}