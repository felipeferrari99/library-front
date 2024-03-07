import { Link } from "react-router-dom";

import './Navbar.css'

export default function Navbar() {
    return (
      <nav className="navbar">
        <h2>
            <Link to={'/'}>Library</Link>
        </h2>
        <ul>
            <li>
                <Link to={'/'}>Home</Link>
            </li>
            <li>
                <Link to={'/books'}>Books</Link>
            </li>
            <li>
                <Link to={'/newBook'}>New Book</Link>
            </li>
        </ul>
      </nav>
    )
  }