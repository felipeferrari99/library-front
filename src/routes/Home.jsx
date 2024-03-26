'use client';

import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mt-10 mb-10 font-bold">Welcome to Dream Bookshelf!</h1>
      <Link to={'/books'}>
        <Button children="View Books!" />
      </Link>
    </div>
  );
}