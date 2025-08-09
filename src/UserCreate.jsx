import { useState } from 'react';



import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function UserCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    empId: '',
    userId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    mobile: '',
    email: '',
    reportingManager: '',
    maritalStatus: 'No',
    gender: 'Male',
    role: '', // ✅ Added role field
    password: '',
    confirmPassword: '',
    dept: '',
    designation: '',
    birthDate: '',
    joinDate: '',
    branch: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let errs = {};
    if (!form.empId.trim()) errs.empId = 'Employee ID is required';
    if (!form.userId.trim()) errs.userId = 'User ID is required';
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.mobile.match(/^[0-9]{10}$/)) errs.mobile = 'Enter valid 10-digit mobile number';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter valid email address';
    if (!form.role) errs.role = 'Select a role'; // ✅ validate role
    if (!form.password) errs.password = 'Password is required';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.dept) errs.dept = 'Select a department';
    if (!form.branch) errs.branch = 'Select a branch';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/users', form);
      alert('✅ User created successfully!');
      navigate('/users');
    } catch (error) {
      console.error(error);
      alert('❌ Failed to create user');
    }
  };

  return (
    <div className='max-w-4xl mx-auto bg-white p-6 shadow rounded-lg'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold'>New User Registration</h2>
        <Link
          to='/users'
          className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'>
          ← Back to Users
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Employee ID */}
        <div>
          <input
            name='empId'
            value={form.empId}
            onChange={handleChange}
            placeholder='Employee ID'
            className={`border p-2 rounded w-full ${errors.empId ? 'border-red-500' : ''}`}
          />
          {errors.empId && <p className='text-red-500 text-sm'>{errors.empId}</p>}
        </div>

        {/* User ID */}
        <div>
          <input
            name='userId'
            value={form.userId}
            onChange={handleChange}
            placeholder='User ID'
            className={`border p-2 rounded w-full ${errors.userId ? 'border-red-500' : ''}`}
          />
          {errors.userId && <p className='text-red-500 text-sm'>{errors.userId}</p>}
        </div>

        {/* First Name */}
        <div>
          <input
            name='firstName'
            value={form.firstName}
            onChange={handleChange}
            placeholder='First Name'
            className={`border p-2 rounded w-full ${errors.firstName ? 'border-red-500' : ''}`}
          />
          {errors.firstName && <p className='text-red-500 text-sm'>{errors.firstName}</p>}
        </div>

        {/* Middle Name */}
        <input
          name='middleName'
          value={form.middleName}
          onChange={handleChange}
          placeholder='Middle Name'
          className='border p-2 rounded w-full'
        />

        {/* Last Name */}
        <div>
          <input
            name='lastName'
            value={form.lastName}
            onChange={handleChange}
            placeholder='Last Name'
            className={`border p-2 rounded w-full ${errors.lastName ? 'border-red-500' : ''}`}
          />
          {errors.lastName && <p className='text-red-500 text-sm'>{errors.lastName}</p>}
        </div>

        {/* Birth Date */}
        <input
          type='date'
          name='birthDate'
          value={form.birthDate}
          onChange={handleChange}
          className='border p-2 rounded'
        />

        {/* Mobile */}
        <div>
          <input
            name='mobile'
            value={form.mobile}
            onChange={handleChange}
            placeholder='Mobile No'
            className={`border p-2 rounded w-full ${errors.mobile ? 'border-red-500' : ''}`}
          />
          {errors.mobile && <p className='text-red-500 text-sm'>{errors.mobile}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={handleChange}
            placeholder='Email ID'
            className={`border p-2 rounded w-full ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}
        </div>

        {/* Reporting Manager */}
        <input
          name='reportingManager'
          value={form.reportingManager}
          onChange={handleChange}
          placeholder='Reporting Manager'
          className='border p-2 rounded w-full'
        />

        {/* Marital Status */}
        <select
          name='maritalStatus'
          value={form.maritalStatus}
          onChange={handleChange}
          className='border p-2 rounded'>
          <option value='Yes'>Married</option>
          <option value='No'>Unmarried</option>
        </select>

        {/* Gender */}
        <div className='flex items-center gap-4'>
          <label>
            <input
              type='radio'
              name='gender'
              value='Male'
              checked={form.gender === 'Male'}
              onChange={handleChange}
            />{' '}
            Male
          </label>
          <label>
            <input
              type='radio'
              name='gender'
              value='Female'
              checked={form.gender === 'Female'}
              onChange={handleChange}
            />{' '}
            Female
          </label>
        </div>

        {/* ✅ Role */}
        <div>
          <select
            name='role'
            value={form.role}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.role ? 'border-red-500' : ''}`}>
            <option value=''>Select Role</option>
            <option value='Admin'>Admin</option>
            <option value='Manager'>Manager</option>
            <option value='User'>User</option>
          </select>
          {errors.role && <p className='text-red-500 text-sm'>{errors.role}</p>}
        </div>

        {/* Password */}
        <div>
          <input
            type='password'
            name='password'
            value={form.password}
            onChange={handleChange}
            placeholder='Password'
            className={`border p-2 rounded w-full ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && <p className='text-red-500 text-sm'>{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type='password'
            name='confirmPassword'
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder='Confirm Password'
            className={`border p-2 rounded w-full ${
              errors.confirmPassword ? 'border-red-500' : ''
            }`}
          />
          {errors.confirmPassword && (
            <p className='text-red-500 text-sm'>{errors.confirmPassword}</p>
          )}
        </div>

        {/* Department */}
        <div>
          <select
            name='dept'
            value={form.dept}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.dept ? 'border-red-500' : ''}`}>
            <option value=''>Select Department</option>
            <option value='Holiday'>Holiday</option>
            <option value='Air Ticketing'>Air Ticketing</option>
            <option value='Visa'>Visa</option>
          </select>
          {errors.dept && <p className='text-red-500 text-sm'>{errors.dept}</p>}
        </div>

        {/* Designation */}
        <input
          name='designation'
          value={form.designation}
          onChange={handleChange}
          placeholder='Designation'
          className='border p-2 rounded w-full'
        />

        {/* Date of Joining */}
        <input
          type='date'
          name='joinDate'
          value={form.joinDate}
          onChange={handleChange}
          className='border p-2 rounded'
        />

        {/* Branch */}
        <div>
          <select
            name='branch'
            value={form.branch}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.branch ? 'border-red-500' : ''}`}>
            <option value=''>Select Branch</option>
            <option value='Pune HO'>Pune HO</option>
            <option value='PCMC'>PCMC</option>
            <option value='Nashik'>Nashik</option>
          </select>
          {errors.branch && <p className='text-red-500 text-sm'>{errors.branch}</p>}
        </div>

        <div className='md:col-span-2 flex justify-end gap-2 mt-4'>
          <button
            type='submit'
            className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700'>
            Save User
          </button>
        </div>
      </form>
    </div>
  );
}
