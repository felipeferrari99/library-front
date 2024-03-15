import { useState, useEffect } from "react";
import libraryFetch from "../../axios/config";
import moment from 'moment';

const AllRents = () => {
  const [rents, setRents] = useState(null);

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
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>All Rents</h2>
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
          {rents.map((rent) => (
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