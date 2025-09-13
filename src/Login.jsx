import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from './config';
import axios from 'axios';
import { UserProvider } from './SessionContext';
import { useGetSessionUser } from './SessionContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const { setUser  } = useGetSessionUser();   // ✅ from context
  //const navigate = useNavigate();

  const handleLogin = async (e) => {
    console.log('user', username);
    console.log('pass:', password);
    e.preventDefault();

    debugger;
    setError('');
    const formdata = {
      userId: username,
      password: password,
    };
    try {
      console.log('config APIURL ', config.API_URL);
      const APIURL = config.apiUrl + '/users/login';
      console.log("Connection String to User ...."+APIURL);

      console.log('formdata....:', formdata);

      debugger; 


      const response = await axios.post(APIURL, formdata);
      console.log('res', response);
      // Save userId to localStorage for later API calls

      // ✅ Save full user details in localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(response.data));
      
      // ✅ Update global auth context

      const authData = {
    isLoggedIn: true,
    role: response.data.user.role,
    user: {
      id: response.data.user.userId,
      name: response.data.user.firstName,
      ...response.data.user,
    },
    token: response.data.token, // ✅ also save JWT
  };

  setUser(authData); // update global auth context
      
      navigate('/dashboard');

    


    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data);
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className='flex h-screen items-center justify-center bg-gray-100'>
      <form
        onSubmit={handleLogin}
        className='bg-white p-6 rounded-lg shadow-md w-80'>
        <h2 className='text-2xl font-bold mb-4 text-center'>Login</h2>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='w-full border px-3 py-2 mb-3 rounded'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full border px-3 py-2 mb-3 rounded'
        />
        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>
          Login
        </button>
      </form>
    </div>
  );
}
