import { getAuthor, updateAuthor, changeImage } from '../../requests/authors';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FloatingLabel, FileInput, Modal } from 'flowbite-react';
import Button from '../../components/Button';
import { toast } from 'react-toastify';

const EditAuthor = () => {
  const [author, setAuthor] = useState(null);
  const { id } = useParams();
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          setType(decodedToken.type);
        }
        const response = await getAuthor(id)
        setAuthor(response.author[0]);
      } catch (error) {
        toast.error(`Error fetching author data: ${error.response.data.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [id]);

  useEffect(() => {
    if (author) {
      setName(author.name);
      setDescription(author.description);
    }
  }, [author]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        await updateAuthor(id, name, description)
        toast.success('Author updated successfully!');
        navigate(`/authors/${id}`);
    } catch (error) {
      toast.error(`Error during author update: ${error.response.data.message}`);
    }
  };

  const handleImageSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    try {
      await changeImage(id, formData);
      window.location.reload();
    } catch (error) {
      console.error('Error during author update:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-10 max-w-md mx-auto">
      {type != 'admin' ? (
        navigate(`/authors/${id}`)
      ) : (
      <div>
      <h2 className="text-2xl text-center font-semibold mb-6">Edit Author</h2>
      <button onClick={() => setOpenModal(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-5">Change Image</button>
        <Modal className='mt-12 md:mt-0' dismissible show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
          <Modal.Header className="bg-gray-900" />
          <Modal.Body className="bg-gray-900">
            <div className="text-center">
              <h2 className='mb-3'>Current image for: {author.name}</h2>
              <img style={{ width: '12rem', height: '14rem' }} className="mx-auto mr-18 md:mr-13" src={author.image} alt={author.name}/>
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
          <FloatingLabel variant="filled" label="Author Name" name="name" type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}/>
        </div>
        <div className="mb-5">
          <FloatingLabel variant="filled" label="Description" name="description" type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)}/>
        </div>
        <Button children="Update Author" />
      </form>
      <a href={`/authors/${id}`} className="block mt-5 text-blue-500 hover:text-blue-700">Cancel</a>
      </div>
      )}
    </div>
  );
};

export default EditAuthor;