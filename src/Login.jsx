import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const navigate = useNavigate(); // v6+

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
console.log("formdata:::::::::::::",formData)
console.log("email:::::::::::::",formData.email)
console.log("formdata:::::::::::::",formData.password)
    // ✅ Hardcoded login check
    if (formData.email === 'admin' && formData.password === 'admin') {
      setIsLoggedIn(true);

      navigate('/dashboard'); // v6+
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-lg p-8'>
        <h2 className='text-2xl font-bold text-center mb-6'>Login</h2>

        {error && <div className='mb-4 text-red-500 text-center font-medium'>{error}</div>}

        <form
          onSubmit={handleSubmit}
          className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Username</label>
            <input
              type='text'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter username'
              required
              className='w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-1'>Password</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Enter password'
              required
              className='w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300'
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
