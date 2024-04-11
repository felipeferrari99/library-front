import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FloatingLabel } from 'flowbite-react';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import { getBook } from '../../requests/books';
import { newRent } from '../../requests/rents';

const NewRent = () => {
  const [book, setBook] = useState(null);
  const { id } = useParams();
  const [days, setDays] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await getBook(id);
        setBook(response.book);
      } catch (error) {
        console.error('Error fetching book data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await newRent(id, days)
      toast.success('Book rented successfully!');
      navigate(`/myrents`);
    } catch (error) {
      toast.error(`Error during rent: ${error.response.data.message}`);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-between max-w-5xl mx-auto p-2 md:p-12">
      <div className="w-full lg:w-1/2 p-5">
        <div className="flex flex-col items-center">
          <h2 className="text-3xl mb-5">Renting: {book.title.slice(0, 30)}</h2>
          <img style={{ width: "35vh", height: "53vh" }} src={book.image} alt={book.title} />
          <div className="mt-5">
            <a href="/available" className="block mt-5 text-blue-500 hover:text-blue-700">Cancel</a>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 p-5 md:mt-10">
        <form onSubmit={handleSubmit}>
          <div className="md:mt-7 mb-5">
            <FloatingLabel
              variant="filled"
              label="How many days do you want to rent this book for?"
              name="days"
              type="number"
              id="days"
              className="rounded-lg"
              value={days}
              onChange={(event) => setDays(event.target.value)}
            />
          </div>
          <Button children='Rent' />
        </form>
      </div>
    </div>
  );
};

export default NewRent;