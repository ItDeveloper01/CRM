import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, UserPlus, CalendarCheck, LogOut, X} from 'lucide-react';
import { redirect } from 'react-router-dom';

export default function Dashboard({ setIsLoggedIn }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sample Data
  const [leads, setLeads] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'New' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Contacted' },
  ]);
  const [bookings, setBookings] = useState([
    {
      id: 101,
      customer: 'David Brown',
      tour: 'Ladakh Adventure',
      date: '2025-08-20',
      status: 'Confirmed',
    },
  ]);

  // Modal States
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Form Data
  const [newLead, setNewLead] = useState({ name: '', email: '', status: 'New' });
  const [newBooking, setNewBooking

  ] = useState({
    customer: '',
    tour: '',
    date: '',
    status: 'Pending',
  });

  // Handlers
  const addLead = () => {
    setLeads([...leads, { id: leads.length + 1, ...newLead }]);
    setShowLeadModal(false);
    setNewLead({ name: '', email: '', status: 'New' });
  };

  const addBooking = () => {
    setBookings([...bookings, { id: bookings.length + 101, ...newBooking }]);
    setShowBookingModal(false);
    setNewBooking({ customer: '', tour: '', date: '', status: 'Pending' });
  };

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        {/* Dashboard Content */}
        <main className='p-6 overflow-y-auto'>
          {/* Leads Section */}
          <section
            id='leads'
            className='mb-8'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold'>Lead Generation</h2>
              <button
                onClick={() => setShowLeadModal(true)}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
                + Add New Lead
              </button>
            </div>
            <div className='bg-white rounded-lg shadow overflow-x-auto'>
              <table className='min-w-full text-sm text-left'>
                <thead className='bg-gray-100 text-gray-700 uppercase'>
                  <tr>
                    <th className='px-4 py-2'>ID</th>
                    <th className='px-4 py-2'>Name</th>
                    <th className='px-4 py-2'>Email</th>
                    <th className='px-4 py-2'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className='border-b hover:bg-gray-50'>
                      <td className='px-4 py-2'>{lead.id}</td>
                      <td className='px-4 py-2'>{lead.name}</td>
                      <td className='px-4 py-2'>{lead.email}</td>
                      <td className='px-4 py-2'>{lead.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Bookings Section */}
          <section id='bookings'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-lg font-semibold'>Customers</h2>
              <Link  to='/NewCustomer'>
              <button 
                className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700'>
                + New Customer
              </button> 
              </Link>
            </div>
            <div className='bg-white rounded-lg shadow overflow-x-auto'>
              <table className='min-w-full text-sm text-left'>
                <thead className='bg-gray-100 text-gray-700 uppercase'>
                  <tr>
                    <th className='px-4 py-2'>Customer ID</th>
                    <th className='px-4 py-2'>Customer</th>
                    <th className='px-4 py-2'>Tour</th>
                    <th className='px-4 py-2'>Date</th>
                    <th className='px-4 py-2'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className='border-b hover:bg-gray-50'>
                      <td className='px-4 py-2'>{booking.id}</td>
                      <td className='px-4 py-2'>{booking.customer}</td>
                      <td className='px-4 py-2'>{booking.tour}</td>
                      <td className='px-4 py-2'>{booking.date}</td>
                      <td className='px-4 py-2'>{booking.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      {/* Lead Modal */}
      {showLeadModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white rounded-lg shadow-lg w-96 p-6 relative'>
            <button
              onClick={() => setShowLeadModal(false)}
              className='absolute top-3 right-3 text-gray-500 hover:text-black'>
              <X size={20} />
            </button>
            <h2 className='text-lg font-bold mb-4'>Add New Lead</h2>
            <input
              type='text'
              placeholder='Name'
              value={newLead.name}
              onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
              className='w-full mb-3 p-2 border rounded'
            />
            <input
              type='email'
              placeholder='Email'
              value={newLead.email}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              className='w-full mb-3 p-2 border rounded'
            />
            <select
              value={newLead.status}
              onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
              className='w-full mb-3 p-2 border rounded'>
              <option>New</option>
              <option>Contacted</option>
              <option>Converted</option>
            </select>
            <button
              onClick={addLead}
              className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>
              Save Lead
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
         <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
          <div className='bg-white rounded-lg shadow-lg w-96 p-6 relative'>
            <button
              onClick={() => setShowBookingModal(false)}
              className='absolute top-3 right-3 text-gray-500 hover:text-black'>
              <X size={20} />
              
            </button>
            <h2 className='text-lg font-bold mb-4'>New Booking</h2>
            <input
              type='text'
              placeholder='Customer Name'
              value={newBooking.customer}
              onChange={(e) => setNewBooking({ ...newBooking, customer: e.target.value })}
              className='w-full mb-3 p-2 border rounded'
            />
            <input
              type='text'  
              placeholder='Tour Name' 
              
              value={newBooking.tour}
              onChange={(e) => setNewBooking({ ...newBooking, tour: e.target.value })}
              className='w-full mb-3 p-2 border rounded'
            />
            <input
              type='date'
              value={newBooking.date}
              onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
              className='w-full mb-3 p-2 border rounded'
            />
            <select
              value={newBooking.status}
              onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value })}
              className='w-full mb-3 p-2 border rounded'>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Cancelled</option>
            </select>
            <button
              onClick={addBooking}
              className='w-full bg-green-600 text-white py-2 rounded hover:bg-green-700'>
              Save Booking
            </button>
          </div>
        </div> 
      )}
    </div>
  );
}
