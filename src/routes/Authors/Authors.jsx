import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuthors } from "../../requests/authors";
import { TextInput, Pagination } from "flowbite-react";
import { HiSearch } from "react-icons/hi";
import Button from "../../components/Button";

export default function Authors() {
  const [authors, setAuthors] = useState([]);
  const [type, setType] = useState(null);
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const onPageChange = (page) => setCurrentPage(page);

  const fetchData = async () => {
    try {
      const response = await getAuthors(search)
      setAuthors(response);
      setTotalPages(Math.ceil(response.length / 3));
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
    fetchData();
  }, [search]);

  const indexOfLastAuthor = currentPage * 3;
  const indexOfFirstAuthor = indexOfLastAuthor - 3;
  const currentAuthors = authors.slice(indexOfFirstAuthor, indexOfLastAuthor);
  return (
    <div className="p-12">
       <h1 className="text-5xl text-center mb-8">AUTHORS</h1>
       <TextInput className="mx-auto max-w-md" id="search" type="text" icon={HiSearch} placeholder="Search the name of an author!" onInput={(e) => setCurrentPage(1)} onChange={(e) => setSearch(e.target.value)} />
       <div className="flex flex-wrap justify-between">
        {authors.length === 0 ? (
          <p className="text-center text-gray-500">No authors found!</p>
        ) : (
          currentAuthors.map((author) => (
            <div className="w-full md:w-1/3 p-5 md:p-10 text-center mb-12 md:mb-0 cursor-pointer" key={author.id}>
              <Link to={`/authors/${author.id}`} className="block">
                <h2 className="text-2xl font-bold mb-2">{author.name.slice(0, 23)}</h2>
              </Link>
              <Link to={`/authors/${author.id}`}>
                <img className="author-image mx-auto" src={author.image} alt={author.name}/>
              </Link>
            </div>
          ))
        )}
      </div>
      <div className="text-center">
      {authors.length > 0 && (
          <Pagination
            layout="pagination"
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            previousLabel="Back"
            showIcons
          />
      )}
        {type === 'admin' && (
          <div className="mt-5" >
            <Link to='/newauthor'>
              <Button children="Create Author" />
            </Link>
          </div>
        )}
      </div>
      <style jsx="true">{`.author-image {width: 40vh; height: 40vh;}`}</style>
    </div>
  )
}