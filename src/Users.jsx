import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'user', role: 'user' },
  ]);

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
      <div className='bg-white rounded-lg shadow overflow-x-auto'>
        <table className='min-w-full text-sm text-left'>
          <thead className='bg-gray-100 text-gray-700 uppercase'>
            <tr>
              <th className='px-4 py-2'>ID</th>
              <th className='px-4 py-2'>Username</th>
              <th className='px-4 py-2'>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                className='border-b hover:bg-gray-50'>
                <td className='px-4 py-2'>{u.id}</td>
                <td className='px-4 py-2'>{u.username}</td>
                <td className='px-4 py-2'>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
