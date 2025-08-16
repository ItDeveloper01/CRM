import { useState, useEffect } from 'react';
import config from './config';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'user', role: 'user' },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(config.apiUrl + '/Users/GetAlUsers');
        setUsers(res.data);
      } catch (err) {
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  if (loading) return <p className='p-4'>Loading users...</p>;
  if (error) return <p className='p-4 text-red-500'>{error}</p>;

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Users</h2>
        <Link
          to='/users/create'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
          + Add User
        </Link>
      </div>

      {/* Users Table */}
      <div className='max-w mx-auto p-6 bg-white shadow rounded-lg'>
        <table className='w-full border border-gray-300 rounded-lg'>
          <thead>
            <tr className='bg-gray-100'>
              <th className='p-2 text-left'>User ID</th>
              <th className='p-2 text-left'>Name</th>
              <th className='p-2 text-left'>Mobile No</th>
              <th className='p-2 text-left'>Email Id</th>
              <th className='p-2 text-left'>Department</th>
              <th className='p-2 text-left'>Designation</th>
              <th className='p-2 text-left'>Role</th>
              <th className='p-2 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.userId}
                className='border-t'>
                <td className='p-2'>{u.userId}</td>
                <td className='p-2'>
                  {u.firstName} {u.lastName}
                </td>
                <td className='p-2'>{u.mobileNo}</td>
                <td className='p-2'>{u.emailId}</td>
                <td className='p-2'>{u.department}</td>
                <td className='p-2'>{u.designation}</td>
                <td className='p-2'>{u.role}</td>
                <td className='p-2'>
                  <Link
                    to={`/users/${u.userId}`}
                    className='text-blue-500 hover:underline'>
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
