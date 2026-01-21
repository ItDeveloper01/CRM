// import { useState } from "react";
// // import UpdateLeadsModal from "../components/UpdateLeadsModal";

// export default function Leads() {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [mode, setMode] = useState("create");

//   // CREATE
//   const handleCreate = () => {
//     setSelectedLead(null);
//     setMode("create");
//     setIsModalOpen(true);
//   };

//   // EDIT
//   const handleEdit = (lead) => {
//     setSelectedLead(lead);
//     setMode("edit");
//     setIsModalOpen(true);
//   };

//   // VIEW
//   const handleView = (lead) => {
//     setSelectedLead(lead);
//     setMode("view");
//     setIsModalOpen(true);
//   };

  // return (
  //   <>
  //     {/* Create Button */}
  //     <button onClick={handleCreate}>Create Lead</button>

  //     {/* Leads Table */}
  //     <table>
  //       {leads.map((lead) => (
  //         <tr key={lead.id}>
  //           <td>{lead.name}</td>
  //           <td>
  //             <button onClick={() => handleView(lead)}>View</button>
  //             <button onClick={() => handleEdit(lead)}>Edit</button>
  //           </td>
  //         </tr>
  //       ))}
  //     </table>

  //     {/* Modal */}
  //     <UpdateLeadsModal
  //       isOpen={isModalOpen}
  //       onClose={() => setIsModalOpen(false)}
  //       lead={selectedLead}
  //       mode={mode}
  //     />
  //   </>
  // );
// }







// import { useState } from 'react';
// import { Link } from 'react-router-dom';

// export default function Leads() {
//   const [leads, setLeads] = useState([
//     { id: 1, name: 'John Doe', email: 'john@example.com', status: 'New' },
//     { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Contacted' },
//   ]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({ name: '', email: '', status: 'New' });

//   const addLead = (e) => {
//     e.preventDefault();
//     setLeads([...leads, { id: leads.length + 1, ...formData }]);
//     setIsModalOpen(false);
//     setFormData({ name: '', email: '', status: 'New' });
//   };

//   return (
//     <div>
//       <div className='flex justify-between items-center mb-4'>
//         <h2 className='text-xl font-semibold'>Leads</h2>
//         <Link to='/LeadsGeneration'>
//           <button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
//             + Add Lead
//           </button>
//         </Link>
//       </div>

//       {/* Leads Table */}
//       <div className='bg-white rounded-lg shadow overflow-x-auto'>
//         <table className='min-w-full text-sm text-left'>
//           <thead className='bg-gray-100 text-gray-700 uppercase'>
//             <tr>
//               <th className='px-4 py-2'>ID</th>
//               <th className='px-4 py-2'>Name</th>
//               <th className='px-4 py-2'>Email</th>
//               <th className='px-4 py-2'>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {leads.map((lead) => (
//               <tr
//                 key={lead.id}
//                 className='border-b hover:bg-gray-50'>
//                 <td className='px-4 py-2'>{lead.id}</td>
//                 <td className='px-4 py-2'>{lead.name}</td>
//                 <td className='px-4 py-2'>{lead.email}</td>
//                 <td className='px-4 py-2'>{lead.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

