import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const backgroundImage = `url('https://images.alphacoders.com/133/1339726.png')`;

const Home = () => {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), ${backgroundImage}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '91vh',
        width: '100vw',
      }}
    >
      <h1 className="text-2xl md:text-3xl mt-10 mb-10 font-bold text-white">Welcome to Dream Bookshelf!</h1>
      <Link to={'/books'}>
        <Button
          children="View Books!"
          style={{
            fontSize: '1.5rem',
            padding: '0.75rem 2rem',
          }}
        />
      </Link>
    </div>
  );
};

export default Home;