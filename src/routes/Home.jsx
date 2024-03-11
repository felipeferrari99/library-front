import { Link } from 'react-router-dom';

import './Home.css'

export default function Home() {
    return (
      <div className='home'>
        <h1>Welcome to Library!</h1>
        <button><Link to={'/books'}>View Books!</Link></button>
      </div>
    )
  }