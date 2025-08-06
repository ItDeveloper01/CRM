import { useState } from 'react';

export default function Leads() {
  const [leads, setLeads] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'New' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Contacted' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', status: 'New' });

  const addLead = (e) => {
    e.preventDefault();
    setLeads([...leads, { id: leads.length + 1, ...formData }]);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', status: 'New' });
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Leads</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
          + Add Lead
        </button>
      </div>

      {/* Leads Table */}
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

      {/* Add Lead Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg shadow w-96'>
            <h2 className='text-lg font-semibold mb-4'>Add Lead</h2>
            <form
              onSubmit={addLead}
              className='space-y-4'>
              <input
                type='text'
                placeholder='Name'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className='w-full border px-3 py-2 rounded'
                required
              />
              <input
                type='email'
                placeholder='Email'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className='w-full border px-3 py-2 rounded'
                required
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className='w-full border px-3 py-2 rounded'>
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
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
