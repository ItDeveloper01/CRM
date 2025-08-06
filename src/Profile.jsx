import { useState } from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react'; // optional icons

export default function Profile() {
  const [user] = useState({
    name: 'Ameya Joglekar',
    email: 'ameya@example.com',
    phone: '+91 9876543210',
    location: 'Pune, India',
    bio: 'Travel enthusiast ✈️ | Explorer 🌍 | Loves creating memorable journeys',
    avatar: 'https://i.pravatar.cc/150?img=3', // placeholder avatar
  });

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-6'>
      <div className='w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8'>
        {/* Profile Header */}
        <div className='flex items-center gap-6'>
          <img
            src={user.avatar}
            alt='profile'
            className='w-24 h-24 rounded-full border-4 border-blue-500'
          />
          <div>
            <h2 className='text-2xl font-bold'>{user.name}</h2>
            <p className='text-gray-600'>{user.bio}</p>
          </div>
        </div>

        <hr className='my-6' />

        {/* Profile Info */}
        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <Mail className='w-5 h-5 text-blue-600' />
            <span>{user.email}</span>
          </div>
          <div className='flex items-center gap-3'>
            <Phone className='w-5 h-5 text-blue-600' />
            <span>{user.phone}</span>
          </div>
          <div className='flex items-center gap-3'>
            <MapPin className='w-5 h-5 text-blue-600' />
            <span>{user.location}</span>
          </div>
        </div>

        <hr className='my-6' />

        {/* Actions */}
        <div className='flex justify-between'>
          <button className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
            Edit Profile
          </button>
          <button className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
