import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { createBrowserRouter, RouterProvider, Route } from "react-router-dom"

import Home from './routes/Home.jsx'
import Login from './routes/Login.jsx'
import Books from './routes/Books.jsx'
import NewBook from './routes/NewBook.jsx'
import ViewBook from './routes/ViewBook.jsx'
import EditBook from './routes/EditBook.jsx'
import ChangeImage from './routes/ChangeImage.jsx'

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
        element: <ChangeImage />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
