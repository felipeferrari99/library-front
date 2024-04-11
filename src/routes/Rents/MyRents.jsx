import { useState, useEffect } from "react";
import moment from 'moment';
import Button from '../../components/Button';
import { toast } from 'react-toastify';
import { getMyRents, returnBook } from "../../requests/rents";

const MyRents = () => {
  const [rents, setRents] = useState(null);
  const [statusFilter, setStatusFilter] = useState('active');

  const getRents = async () => {
    try {
      const response = await getMyRents()
      setRents(response);
    } catch (error) {
      toast.error(`Error getting rents: ${error.response.data.message}`);
    }
  };

  const ReturnBook = async (id) => {
    try {
      await returnBook(id)
      setRents((prevRents) =>
        prevRents.map((rent) => (rent.id === id ? { ...rent, status: "returned" } : rent))
      );
      toast.success('Book returned!');
    } catch (error) {
      toast.error(`Error returning book: ${error.response.data.message}`);
    }
  };

  useEffect(() => {
    getRents();
  }, []);

  useEffect(() => {
    if (rents && rents.length > 0) {
      const lateRents = rents.filter((rent) => rent.status === 'late');
      if (lateRents.length > 0) {
        toast.error(`You have ${lateRents.length} rent(s) late!`)
      }
    }
  }, [rents]);

  if (!rents) {
    return <div className="p-8">No rents found!</div>;
  }

  const filteredRents = rents.filter((rent) => statusFilter === 'all' || rent.status === statusFilter);

  return (
    <div className="p-4 md:p-12">
      <h2 className="text-2xl font-bold mb-4">All Rents</h2>
      <div className="flex items-center mb-5">
        <button onClick={() => setStatusFilter('all')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          All
        </button>
        <button onClick={() => setStatusFilter('active')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          Active
        </button>
        <button onClick={() => setStatusFilter('returned')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
          Returned
        </button>
        <button onClick={() => setStatusFilter('late')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Late
        </button>
      </div>
      <table className="w-full text-center text-xs md:text-lg">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Book</th>
            <th className="px-4 py-2">Rent Start</th>
            <th className="px-4 py-2">Rent End</th>
            <th className="px-4 py-2">Status</th>
            {statusFilter !== 'returned' && (
              <th className="px-4 py-2">Return</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredRents.map((rent) => (
            <tr key={rent.id}>
              <td className="border md:px-4 md:py-2">{rent.id}</td>
              <td className="border md:px-4 md:py-2">{rent.title.slice(0, 30)}</td>
              <td className="border md:px-4 md:py-2">{moment.utc(rent.date_rented).format('DD/MM/YYYY')}</td>
              <td className="border md:px-4 md:py-2">{moment.utc(rent.date_for_return).format('DD/MM/YYYY')}</td>
              <td className="border md:px-4 md:py-2">{rent.status}</td>
              {rent.status !== 'returned' && (
                <td className="border md:px-4 md:py-2">
                  <Button onClick={() => ReturnBook(rent.id)} children='Return Book' />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyRents;