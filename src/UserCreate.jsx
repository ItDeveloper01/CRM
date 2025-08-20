import { useState } from 'react';
import ArrowLeft from './arrow-left.png';
import MultiSelectDropdown from './MultiSelectDropdown';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function UserCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    empId: '',
    userId: '',
    UserName: '',
    firstName: '',
    middleName: '',
    lastName: '',
    mobileNo: '',
    emailId: '',
    reportingManager: '',
    gender: '',
    role: '',
    password: '',
    department: '',
    designation: '',
    birthDate: '',
    joiningDate: '',
    branch: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const options = ['Select Department', 'Holiday', 'Air Ticketing', 'Visa'];

  const handleChangeDropDown = (selectedOptions) => {
    console.log('Selected:', selectedOptions);
  };

  const validate = () => {
    let errs = {};
    if (!form.empId.trim()) errs.empId = 'Employee ID is required';
    if (!form.userId.trim()) errs.userId = 'User ID is required';
    if (!form.firstName.trim()) errs.firstName = 'First name is required';
    //   if (!form.middleName.trim()) errs.middleName = 'Middle name is required';
    if (!form.lastName.trim()) errs.lastName = 'Last name is required';
    if (!form.mobileNo.match(/^[0-9]{10}$/)) errs.mobileNo = 'Enter valid 10-digit mobile number';
    if (!form.emailId.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.emailId = 'Enter valid email address';
    if (!form.role) errs.role = 'Select a role';
    //   if (!form.reportingManager) errs.reportingManager = 'Select a reportingManager';
    if (!form.password) errs.password = 'Password is required';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    //   if (!form.department) errs.department = 'Select a department';
    //  if (!form.branch) errs.branch = 'Select a branch';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('form', form);
    const updatedData = {
      ...form, // your existing form data
      createdBy: localStorage.getItem('loggedInUser'), // get from localStorage
      createdAt: new Date().toISOString(), // current date & time
    };

    console.log('updated data:', updatedData);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.post('http://192.133.1.12:5000/api/users', updatedData);
      alert('✅ User created successfully!');
      navigate('/users');
    } catch (error) {
      console.log('error1', error.response.data.errors);
      alert('❌ Failed to create user', error.response.data.errors[0]);
    }
  };

  return (
    <div className='max-w-8xl mx-auto bg-white p-6 shadow rounded-lg'>
      {/* Header */}
      <div className='flex items-center gap-x-4 mb-6'>
        <Link to='/users'>
          <img
            src={ArrowLeft}
            alt='Back arrow'
            className='h-6 w-6 inline-block'
          />
        </Link>
        <h2 className='text-2xl font-bold'>New User Registration</h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* First Name */}
        <div>
          <label
            htmlFor='firstName'
            className='text-sm font-medium text-gray-700 whitespace-nowrap'>
            First Name
          </label>
          <input
            id='firstName'
            name='firstName'
            value={form.firstName}
            onChange={handleChange}
            placeholder='First Name'
            className={`border p-2 rounded w-full ${errors.firstName ? 'border-red-500' : ''}`}
          />
          {errors.firstName && <p className='text-red-500 text-sm'>{errors.firstName}</p>}
        </div>

        {/* Middle Name */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Middle Name</label>
          <input
            name='middleName'
            value={form.middleName}
            onChange={handleChange}
            placeholder='Middle Name'
            className={`border p-2 rounded w-full ${errors.middleName ? 'border-red-500' : ''}`}
          />
          {errors.middleName && <p className='text-red-500 text-sm'>{errors.middleName}</p>}
        </div>

        {/* Last Name */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Last Name</label>
          <input
            name='lastName'
            value={form.lastName}
            onChange={handleChange}
            placeholder='Last Name'
            className={`border p-2 rounded w-full ${errors.lastName ? 'border-red-500' : ''}`}
          />
          {errors.lastName && <p className='text-red-500 text-sm'>{errors.lastName}</p>}
        </div>

        {/* User ID */}
        <div>
          <label
            htmlFor='userId'
            className='text-sm font-medium text-gray-700 whitespace-nowrap'>
            User ID
          </label>
          <input
            id='userId'
            name='userId'
            value={form.userId}
            onChange={handleChange}
            placeholder='User ID'
            className={`border p-2 rounded w-full ${errors.userId ? 'border-red-500' : ''}`}
          />
          {errors.userId && <p className='text-red-500 text-sm'>{errors.userId}</p>}
        </div>

        {/* Password */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Password</label>
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
          <label className='text-sm font-medium text-gray-700'>Confirm Password</label>
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

        {/* Birth Date */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Birth Date</label>
          <input
            type='date'
            name='birthDate'
            value={form.birthDate}
            onChange={handleChange}
            className='border p-2 rounded w-full'
          />
        </div>

        {/* Mobile */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Mobile No</label>
          <input
            name='mobileNo'
            value={form.mobileNo}
            onChange={handleChange}
            placeholder='Mobile No'
            className={`border p-2 rounded w-full ${errors.mobileNo ? 'border-red-500' : ''}`}
          />
          {errors.mobileNo && <p className='text-red-500 text-sm'>{errors.mobileNo}</p>}
        </div>

        {/* Email */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Email ID</label>
          <input
            type='email'
            name='emailId'
            value={form.emailId}
            onChange={handleChange}
            placeholder='Email ID'
            className={`border p-2 rounded w-full ${errors.emailId ? 'border-red-500' : ''}`}
          />
          {errors.emailId && <p className='text-red-500 text-sm'>{errors.emailId}</p>}
        </div>

        {/* Reporting Manager */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Reporting Manager</label>
          <select
            name='reportingManager'
            value={form.reportingManager}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${
              errors.reportingManager ? 'border-red-500' : ''
            }`}>
            <option value=''>Select Manager</option>
            <option value='Akhilesh Joshi'>Akhilesh Joshi</option>
            <option value='Shreedev Hole'>Shreedev Hole</option>
            <option value='Minal Joshi'>Minal Joshi</option>
            <option value='Akhilesh Joshi'>Akhilesh Joshi</option>
          </select>
          {errors.reportingManager && (
            <p className='text-red-500 text-sm'>{errors.reportingManager}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Role</label>
          <select
            name='role'
            value={form.role}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.role ? 'border-red-500' : ''}`}>
            <option value=''>Select Role</option>
            <option value='Super Admin'>Super Admin</option>
            <option value='Admin'>Admin</option>
            <option value='Manager'>Manager</option>
            <option value='User'>User</option>
          </select>
          {errors.role && <p className='text-red-500 text-sm'>{errors.role}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Gender</label>
          <div className='flex items-center gap-4 mt-1'>
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
        </div>

        {/* Department */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Reporting Manager</label>
          <select
            name='department'
            value={form.department}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.department ? 'border-red-500' : ''}`}>
            <option value=''>Select Department</option>
            <option value='Holiday'>Holiday</option>
            <option value='Air Ticketing'>Air Ticketing</option>
            <option value='Visa'>Visa</option>
            <option value='Cars and Coaches'>Cars and Coaches</option>
            <option value='MICE'>MICE</option>
          </select>
          {errors.reportingManager && (
            <p className='text-red-500 text-sm'>{errors.reportingManager}</p>
          )}
        </div>

        {/* Designation */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Designation</label>
          <input
            name='designation'
            value={form.designation}
            onChange={handleChange}
            placeholder='Designation'
            className='border p-2 rounded w-full'
          />
        </div>

        {/* Date of Joining */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Date of Joining</label>
          <input
            type='date'
            name='joiningDate'
            value={form.joiningDate}
            onChange={handleChange}
            className='border p-2 rounded w-full'
          />
        </div>

        {/* Branch */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Branch</label>
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

        {/* Employee ID */}
        <div>
          <label
            htmlFor='empId'
            className='text-sm font-medium text-gray-700 whitespace-nowrap'>
            Employee ID
          </label>
          <input
            id='empId'
            name='empId'
            value={form.empId}
            onChange={handleChange}
            placeholder='Employee ID'
            className={`border p-2 rounded w-full ${errors.empId ? 'border-red-500' : ''}`}
          />
          {errors.empId && <p className='text-red-500 text-sm'>{errors.empId}</p>}
        </div>

        {/* Submit Button */}
        <div className='md:col-span-3 flex justify-end mt-4'>
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
