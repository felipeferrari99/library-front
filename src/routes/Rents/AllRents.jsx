import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import moment from 'moment';

const AllRents = () => {
  const [rents, setRents] = useState(null);
  const [statusFilter, setStatusFilter] = useState('active');

  const getRents = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await libraryFetch.get(`/allRents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setRents(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRents();
  }, []);

  if (!rents) {
    return <div>No rents found!</div>;
  }

  const filteredRents = rents.filter((rent) => statusFilter === 'all' || rent.status === statusFilter);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">All Rents</h2>
      <div className="flex items-center">
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
      <div className="w-full overflow-hidden rounded-lg shadow-xs">
        <table className="w-full text-center">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Book</th>
              <th className="px-4 py-2">Rent Start</th>
              <th className="px-4 py-2">Rent End</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRents.map((rent) => (
              <tr key={rent.id}>
                <td className="border px-4 py-2">{rent.id}</td>
                <td className="border px-4 py-2">{rent.username}</td>
                <td className="border px-4 py-2">{rent.title}</td>
                <td className="border px-4 py-2">{moment(rent.date_rented).format('DD/MM/YYYY')}</td>
                <td className="border px-4 py-2">{moment(rent.date_for_return).format('DD/MM/YYYY')}</td>
                <td className="border px-4 py-2">{rent.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllRents;