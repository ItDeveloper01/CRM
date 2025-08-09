export default function Navbar() {
  return (
    <header className='h-16 bg-white shadow flex items-center justify-between px-4 py-4'>
      <h1 className='text-xl font-bold'>CRM Dashboard</h1>
      <div className='flex items-center gap-4'>
        <span className='font-medium'>user@example.com</span>
        <img
          src='https://i.pravatar.cc/40'
          alt='avatar'
          className='w-10 h-10 rounded-full'
        />
      </div>
    </header>
  );
}
