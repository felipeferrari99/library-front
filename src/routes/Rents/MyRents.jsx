import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import moment from 'moment';

const MyRents = () => {
  const [rents, setRents] = useState(null);
  const [statusFilter, setStatusFilter] = useState('active');

  const getRents = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await libraryFetch.get(`/myRents`, {
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

  const returnBook = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        libraryFetch.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      await libraryFetch.post(`/return/${id}`);
      setRents((prevRents) =>
        prevRents.map((rent) => (rent.id === id ? { ...rent, status: "returned" } : rent))
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRents();
  }, []);

  if (!rents) {
    return <div>Loading...</div>;
  }

  const filteredRents = rents.filter((rent) => statusFilter === 'all' || rent.status === statusFilter);

  return (
    <div>
      <h2>All Rents</h2>
      <div>
        <button onClick={() => setStatusFilter('all')}>All</button>
        <button onClick={() => setStatusFilter('active')}>Active</button>
        <button onClick={() => setStatusFilter('returned')}>Returned</button>
        <button onClick={() => setStatusFilter('late')}>Late</button>
      </div>
      <table>
        <thead>
            <tr>
              <th>ID</th>
              <th>Book</th>
              <th>Rent Start</th>
              <th>Rent End</th>
              <th>Status</th>
              {statusFilter !== 'returned' && (
              <th>Return</th>
              )}
            </tr>
        </thead>
        <tbody>
          {filteredRents.map((rent) => (
            <tr key={rent.id}>
              <td>{rent.id}</td>
              <td>{rent.title}</td>
              <td>{moment(rent.date_rented).format('DD/MM/YYYY')}</td>
              <td>{moment(rent.date_for_return).format('DD/MM/YYYY')}</td>
              <td>{rent.status}</td>
              {rent.status !== 'returned' && (
                <td><button onClick={() => returnBook(rent.id)}>Return Book</button></td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyRents;