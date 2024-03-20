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
            <th>User</th>
            <th>Book</th>
            <th>Rent Start</th>
            <th>Rent End</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredRents.map((rent) => (
            <tr key={rent.id}>
              <td>{rent.id}</td>
              <td>{rent.username}</td>
              <td>{rent.title}</td>
              <td>{moment(rent.date_rented).format('DD/MM/YYYY')}</td>
              <td>{moment(rent.date_for_return).format('DD/MM/YYYY')}</td>
              <td>{rent.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllRents;