import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import { Link } from "react-router-dom";
import Button from "../../components/Button";

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [type, setType] = useState(null);

  const getAuthors = async () => {
    try {
      const response = await libraryFetch.get("/authors")
      const data = response.data
      setAuthors(data);
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const getToken = () => {
      const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setType(decodedToken.type);
        } 
    };
    getToken();
  });

  useEffect(() => {
    getAuthors();
  }, []);

  return (
    <div className="p-12">
       <h1 className="text-5xl text-center mb-10">AUTHORS</h1>
       <div className="flex flex-wrap justify-between">
        {authors.length === 0 ? (
          <p className="text-center text-gray-500">No authors found!</p>
        ) : (
          authors.map((author) => (
            <div className="w-full md:w-1/3 p-5 md:p-10 text-center mb-12 md:mb-0 cursor-pointer" key={author.id}>
              <Link to={`/authors/${author.id}`} className="block">
                <h2 className="text-2xl font-bold mb-2">{author.name}</h2>
              </Link>
              <Link to={`/authors/${author.id}`}>
                <img className="author-image mx-auto" src={author.image} alt={author.name}/>
              </Link>
            </div>
          ))
        )}
      </div>
      <div className="text-center">
        {type === 'admin' && (
          <Link to='/newauthor'>
            <Button children="Create Author" />
          </Link>
        )}
      </div>
      <style jsx="true">{`.author-image {width: 55%; height: auto;}`}</style>
    </div>
  )
}