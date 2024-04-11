import { getBook, updateBook, changeImage } from '../../requests/books';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { FloatingLabel, FileInput, Modal } from 'flowbite-react';
import Button from '../../components/Button';
import { toast } from 'react-toastify';

const EditBook = () => {
  const [book, setBook] = useState(null);
  const { id } = useParams();
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [qtyAvailable, setQtyAvailable] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setType(decodedToken.type);
        }
        const response = await getBook(id);
        setBook(response.book);
      } catch (error) {
        toast.error(`Error fetching book data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setReleaseDate(book.release_date);
      setQtyAvailable(book.qty_available);
      setAuthor(book.authorName);
      setDescription(book.description);
    }
  }, [book]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        await updateBook(id, title, author, description, moment.utc(releaseDate).format('YYYY-MM-DD'), qtyAvailable)
        toast.success('Book updated successfully!');
        navigate(`/books/${id}`);
    } catch (error) {
      toast.error(`Error during book update: ${error.message}`);
    }
  };

  const handleImageSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);
    try {
      await changeImage(id, formData)
      window.location.reload();
    } catch (error) {
      console.error('Error during book update:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      {type != 'admin' ? (
        navigate(`/books/${id}`)
      ) : (
        <div>
        <h2 className="text-2xl text-center font-semibold mb-6">Edit Book</h2>
        <button onClick={() => setOpenModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-5">Change Image</button>
          <Modal className='mt-12 md:mt-0' dismissible show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
            <Modal.Header className="bg-gray-900" />
            <Modal.Body className="bg-gray-900">
              <div className="text-center">
                <h2 className='mb-3'>Current image for: {book.title}</h2>
                <img className='mx-12 md:mx-16' style={{ width: '15rem', height: '20rem' }} src={book.image} alt={book.title}/>
                <form onSubmit={handleImageSubmit}>
                  <FileInput className='mt-5 mb-5' id="image" onChange={(e) => setImage(e.target.files[0])} />
                  <div className="flex justify-center gap-4">
                    <Button type="submit" children="Update" />
                    <Button children='Cancel' onClick={() => setOpenModal(false)} />
                  </div>
                </form>
              </div>
            </Modal.Body>
          </Modal>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <FloatingLabel variant="filled" label="Book Title" name="title" type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
          </div>
          <div className="mb-5">
            <FloatingLabel variant="filled" label="Author Name" name="author" type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)}/>
          </div>
          <div className="mb-5">
            <FloatingLabel variant="filled" label="Description" name="description" type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)}/>
          </div>
          <div className="mb-5">
            <FloatingLabel variant="filled" label="Release Date" name='releaseDate' type="date" id="releaseDate" max={new Date().toISOString().split("T")[0]} defaultValue={releaseDate ? moment.utc(releaseDate).format('yyyy-MM-DD') : ''} onChange={(e) => setReleaseDate(e.target.value)}/>
          </div>
          <div className="mb-5">
            <FloatingLabel variant="filled" label="Quantity Available" name='qtyAvailable' type="number" id="qtyAvailable" value={qtyAvailable} onChange={(e) => setQtyAvailable(e.target.value)}/>
          </div>
          <Button children="Update Book" />
        </form>
        <a href={`/books/${id}`} className="block mt-5 text-blue-500 hover:text-blue-700">Cancel</a>
        </div>
      )}
    </div>
  );
};

export default EditBook;