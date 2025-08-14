import logo from './logo.svg';
export default function Navbar() {
  const loggedInUser = localStorage.getItem('loggedInUser') || 'Guest';
  const initialLetter = loggedInUser.charAt(0).toUpperCase();

  return (
    <header className='h-16 bg-white shadow flex items-center justify-between px-4 py-4'>
      {/* Logo */}
      <img
        src={logo}
        alt='Logo'
        className='h-10 w-auto'
      />

      {/* User Info */}
      <div className='flex items-center gap-4'>
        <span className='font-medium'>{loggedInUser}</span>
        <div className='w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold'>
          {initialLetter}
        </div>
      </div>
    </header>
  );
}
