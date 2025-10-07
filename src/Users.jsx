import { useState, useEffect } from 'react';
import config from './config';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {useGetSessionUser} from  "./SessionContext"


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

      
      setUsers(res.data || []);
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


const  goToCreateUser = (user) => {
  debugger;

  /*Fetch image for user*/

 
       axios.get(fetchUserImageAPI, {
        headers: {
          Authorization: `Bearer ${sessionUser.token}`, // ✅ JWT token
        },
        params: { userId: user.userId }
      }).then((res) => {
        debugger;
        user = res.data;
        console.log("User Image / Reporting Manager and Categories fetch response:", res);
        debugger;
        // Now navigate
        console.log("Navigating to User..." );
        console.log("Navigating to User..." , user);
          const userObject = user; // or your actual user object
          navigate('/users/create', { state: { user: userObject , myLocation:"Thats It..I can understand."} });
      }).catch((err) => {
        console.error("Error fetching user image:", err);
        debugger  ;

      console.log("User Image fetch response:", err);
      

      debugger;
      }).finally(() => {
       setLoading(false);
      }); 
  
  } 
     //finally {
      //setLoading(false);
    //}


  //console.log("Navigating to User..." );
  //console.log("Navigating to User..." , user);
    //const userObject = user; // or your actual user object
   // navigate('/users/create', { state: { user: userObject , myLocation:"Thats It..I can understand."} });
  


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
               <th className='p-2 text-left'>Status</th>
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
