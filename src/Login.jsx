import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setAuth }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    console.log('user', username);
    console.log('pass:', password);
    e.preventDefault();

    if (username === 'admin' && password === 'admin') {
      setAuth({ isLoggedIn: true, role: 'admin' });
      navigate('/dashboard');
    } else if (username === 'user' && password === 'user') {
      setAuth({ isLoggedIn: true, role: 'user' });
      navigate('/dashboard');

    } else {
      alert('Invalid credentials');
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
