import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      const APIURL = 'http://192.168.1.19:5000/api/users/login';
      const res = await axios.post(APIURL, formdata);
      console.log('res', res);
      // Save userId to localStorage for later API calls
      localStorage.setItem('loggedInUser', res.data.userId);
      setAuth({ isLoggedIn: true, role: res.data.role });
      // alert('Login successful!');
      // Redirect to dashboard (if using React Router)
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
