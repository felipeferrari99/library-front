import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { createBrowserRouter, RouterProvider, Route } from "react-router-dom"

import Home from './routes/Home.jsx'
import Login from './routes/Users/Login.jsx'
import Books from './routes/Books/Books.jsx'
import NewBook from './routes/Books/NewBook.jsx'
import ViewBook from './routes/Books/ViewBook.jsx'
import EditBook from './routes/Books/EditBook.jsx'
import ChangeBookImage from './routes/Books/ChangeBookImage.jsx'
import ViewAuthor from './routes/Authors/ViewAuthor.jsx'
import Authors from './routes/Authors/Authors.jsx'
import ChangeAuthorImage from './routes/Authors/ChangeAuthorImage.jsx'
import EditAuthor from './routes/Authors/EditAuthor.jsx'
import Register from './routes/Users/Register.jsx'
import NewAuthor from './routes/Authors/NewAuthor.jsx'
import User from './routes/Users/User.jsx'
import EditUser from './routes/Users/EditUser.jsx'
import ChangeUserImage from './routes/Users/ChangeUserImage.jsx'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/books",
        element: <Books />
      },
      {
        path: "/newBook",
        element: <NewBook />
      },
      {
        path: "/books/:id",
        element: <ViewBook />
      },
      {
        path: "/books/:id/edit",
        element: <EditBook />
      },
      {
        path: "/books/:id/image",
        element: <ChangeBookImage />
      },
      {
        path: "/authors/:id",
        element: <ViewAuthor />
      },
      {
        path: "/newAuthor",
        element: <NewAuthor />
      },
      {
        path: "/authors",
        element: <Authors />
      },
      {
        path: "/authors/:id/image",
        element: <ChangeAuthorImage />
      },
      {
        path: "/authors/:id/edit",
        element: <EditAuthor />
      },
      {
        path: "/user/:id",
        element: <User />
      },
      {
        path: "/user/:id/edit",
        element: <EditUser />
      },
      {
        path: "/user/:id/image",
        element: <ChangeUserImage />
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
