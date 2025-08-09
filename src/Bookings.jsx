import { useState } from 'react';

export default function Booking() {
  const [bookings, setBookings] = useState([
    {
      id: 101,
      customer: 'David Brown',
      tour: 'Ladakh Adventure',
      date: '2025-08-20',
      status: 'Confirmed',
    },
    {
      id: 102,
      customer: 'Sophia Patel',
      tour: 'Kerala Backwaters',
      date: '2025-09-02',
      status: 'Pending',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ customer: '', tour: '', date: '', status: 'Pending' });

  const addBooking = (e) => {
    e.preventDefault();
    setBookings([...bookings, { id: bookings.length + 101, ...formData }]);
    setIsModalOpen(false);
    setFormData({ customer: '', tour: '', date: '', status: 'Pending' });
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Customer</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
          + Add Booking
        </button>
      </div>

      {/* Bookings Table */}
      <div className='bg-white rounded-lg shadow overflow-x-auto' >
        <table className='min-w-full text-sm text-left' >
          <thead className='bg-gray-100 text-gray-700 uppercase'>
            <tr>
              <th className='px-4 py-2'>Booking ID</th>
              <th className='px-4 py-2'>Booking</th>
              <th className='px-4 py-2'>Tour</th>
              <th className='px-4 py-2'>Date</th>
              <th className='px-4 py-2'>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr
                key={b.id}
                className='border-b hover:bg-gray-50'>
                <td className='px-4 py-2'>{b.id}</td>
                <td className='px-4 py-2'>{b.customer}</td>
                <td className='px-4 py-2'>{b.tour}</td>
                <td className='px-4 py-2'>{b.date}</td>
                <td className='px-4 py-2'>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Booking Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow w-96'>
            <h2 className='text-lg font-semibold mb-4'>Add Booking</h2>
            <form
              onSubmit={addBooking}
              className='space-y-4'>
              <input
                type='text'
                placeholder='Customer Name'
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                className='w-full border px-3 py-2 rounded'
                required
              />
              <input
                type='text'
                placeholder='Tour Name'
                value={formData.tour}
                onChange={(e) => setFormData({ ...formData, tour: e.target.value })}
                className='w-full border px-3 py-2 rounded'
                required
              />
              <input
                type='date'
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className='w-full border px-3 py-2 rounded'
                required
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className='w-full border px-3 py-2 rounded'>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Cancelled</option>
              </select>
              <div className='flex justify-end gap-2'>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='px-4 py-2 border rounded'>
                  Cancel
                </button>
                <button
                  type='submit'
                  className='px-4 py-2 bg-blue-600 text-white rounded'>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
