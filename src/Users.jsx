import { useState, useEffect, useMemo } from 'react';
import config from './config';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {useGetSessionUser} from  "./SessionContext"
import Select from 'react-select';

import { ChevronsUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import {UserCreate} from "./UserCreate";
import { useNavigate } from 'react-router-dom';

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'user', role: 'user' },
  ]);
   const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for multi-select filters
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);

  // State for filter dropdown options
  const [roleOptions, setRoleOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  // State for sorting
  const [sortConfig, setSortConfig] = useState({ key: 'userId', direction: 'ascending' });

   const { user: sessionUser } = useGetSessionUser();
const fetchUsersAPI=config.apiUrl + '/Users/GetAlUsers';
const fetchUserImageAPI=config.apiUrl + '/Users/GetPhotoForUserID';


 useEffect(() => {
  const fetchUsers = async () => {

    debugger;
    try {
      const res = await axios.get(fetchUsersAPI, {
        headers: {
          Authorization: `Bearer ${sessionUser.token}`, // ✅ JWT token
        },
      });

      const fetchedUsers = res.data || [];
      setUsers(fetchedUsers);

      // --- Populate Filter Options ---
      // Roles
      const uniqueRoles = [...new Set(fetchedUsers.map(u => u.roleName).filter(Boolean))];
      setRoleOptions(uniqueRoles.map(role => ({ value: role, label: role })));

      // Statuses
      const uniqueStatuses = [...new Set(fetchedUsers.map(u => u.status).filter(Boolean))];
      setStatusOptions(uniqueStatuses.map(status => ({ value: status, label: status })));

      // Departments (from comma-separated strings)
      const allDepartments = fetchedUsers
        .flatMap(u => (u.categoryNames ? u.categoryNames.split('/').map(d => d.trim()) : []))
        .filter(Boolean);
      const uniqueDepartments = [...new Set(allDepartments)];
      setDepartmentOptions(uniqueDepartments.map(dept => ({ value: dept, label: dept })));

      debugger;
    } catch (err) {

      debugger;
      console.error("Error fetching users:", err);

      if (err.response) {
        // Server responded with a status code outside 2xx
        if (err.response.status === 401) {
          console.log("Unauthorized - please login");
          // redirect to login if needed
        } else if (err.response.status === 403) {
          console.log("Forbidden - you don’t have access");
          // show access denied message
        } else {
          console.log(`Error ${err.response.status}:`, err.response.data);
        }
      } else {
        // Network error
        console.log("Network error - server unreachable");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);


const goToCreateUser = async (user) => {
  try {
    // Fetch the full user details, including the photo and manager info
    const res = await axios.get(fetchUserImageAPI, {
      headers: {
        Authorization: `Bearer ${sessionUser.token}`, // ✅ JWT token
      },
      params: { userId: user.userId }
    });
 debugger;
    const userWithDetails = res.data;
    console.log("User details fetched successfully:", userWithDetails);
    debugger;
    navigate('/users/create', { state: { user: userWithDetails } });
  } catch (err) {
    console.error("Error fetching user details:", err);
    // If the API fails, navigate with the original user data from the table.
    // This makes the UI more resilient.
    console.log("Navigating with fallback user data due to API error.");
    navigate('/users/create', { state: { user: user } });
  }
};


  //console.log("Navigating to User..." );
  //console.log("Navigating to User..." , user);
    //const userObject = user; // or your actual user object
   // navigate('/users/create', { state: { user: userObject , myLocation:"Thats It..I can understand."} });
  

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedUsers = useMemo(() => {    
    // 1. Filtering
    let filteredUsers = users.filter(user => {
      const roleMatch = selectedRoles.length === 0 || selectedRoles.some(r => r.value === user.roleName);
      const statusMatch = selectedStatuses.length === 0 || selectedStatuses.some(s => s.value === user.status);
      
      const userDepartments = user.categoryNames ? user.categoryNames.split('/').map(d => d.trim()) : [];
      const departmentMatch = selectedDepartments.length === 0 || selectedDepartments.some(d => userDepartments.includes(d.value));
  
      return roleMatch && statusMatch && departmentMatch;
    });
  
    // 2. Sorting
    if (sortConfig.key !== null) {
      // Sort a copy of the filtered array to avoid mutation.
      filteredUsers = filteredUsers.slice().sort((a, b) => {
        const aValue = a[sortConfig.key] || '';
        const bValue = b[sortConfig.key] || '';
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
  
    return filteredUsers;
  }, [users, sortConfig, selectedRoles, selectedStatuses, selectedDepartments]);

  const SortableHeader = ({ title, sortKey }) => {
    const isSorted = sortConfig.key === sortKey;
    const Icon = isSorted
      ? (sortConfig.direction === 'ascending' ? ArrowUp : ArrowDown)
      : ChevronsUpDown;

    return (
      <th className='p-2 text-left cursor-pointer' onClick={() => requestSort(sortKey)}>
        <div className='flex items-center gap-2'>
          <span>{title}</span>
          <Icon
            size={14}
            className={isSorted ? 'text-blue-600' : 'text-gray-400'}
          />
        </div>
      </th>
    );
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '38px',
      borderColor: '#d1d5db',
      '&:hover': { borderColor: '#9ca3af' },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 6px'
    }),
  };


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

      {/* Filter Pane */}
      <div className="p-4 mb-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <Select
            isMulti
            options={departmentOptions}
            value={selectedDepartments}
            onChange={setSelectedDepartments}
            placeholder="Filter by Department..."
            styles={customSelectStyles}
            className="text-sm"
          />
          <Select
            isMulti
            options={roleOptions}
            value={selectedRoles}
            onChange={setSelectedRoles}
            placeholder="Filter by Role..."
            styles={customSelectStyles}
            className="text-sm"
          />
          <Select
            isMulti
            options={statusOptions}
            value={selectedStatuses}
            onChange={setSelectedStatuses}
            placeholder="Filter by Status..."
            styles={customSelectStyles}
            className="text-sm"
          />
          <button
            onClick={() => {
              setSelectedRoles([]);
              setSelectedStatuses([]);
              setSelectedDepartments([]);
            }}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 h-[38px] text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className='max-w mx-auto p-6 bg-white shadow rounded-lg'>
        <table className='w-full border border-gray-300 rounded-lg'>
          <thead>
            <tr className='bg-gray-100'>
              <SortableHeader title="User ID" sortKey="userId" />
              <SortableHeader title="Name" sortKey="firstName" />
              <th className='p-2 text-left'>Mobile No</th>
              <th className='p-2 text-left'>Email Id</th>
              <th className='p-2 text-left'>Department</th>
              <th className='p-2 text-left'>Designation</th>
              <th className='p-2 text-left'>Role</th>
               <th className='p-2 text-left'>Status</th>
              <th className='p-2 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUsers.map((u) => (
              <tr
                key={u.userId}
                className='border-t'>
                <td className='p-2'>{u.userId}</td>
                <td className='p-2'>
                  {u.firstName} {u.lastName}
                </td>
                <td className='p-2'>{u.mobileNo}</td>
                <td className='p-2'>{u.emailId}</td>
                <td className='p-2'>{u.categoryNames}</td>
                <td className='p-2'>{u.designation}</td>
                <td className='p-2'>{u.roleName}</td>
                <td className='p-2'>{u.status}</td>
                <td className='p-2'>
                  {/* <Link
                    to={`/users/${u}`}
                    className='text-blue-500 hover:underline'>
                    View Details
                  </Link> */}

                   <button
                      className="text-blue-500 underline"
                     onClick={() => goToCreateUser(u)}
                                        >
                      View Details
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
