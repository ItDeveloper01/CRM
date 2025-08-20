import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, UserPlus, CalendarCheck, LogOut, X } from 'lucide-react';
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
  const [newBooking, setNewBooking] = useState({
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
              <Link to='/LeadsGeneration'>
                <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
                  + Add New Lead
                </button>
              </Link>
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
        </main>
      </div>
    </div>
  );
}
