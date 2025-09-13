import { useEffect, useState } from 'react';
import ArrowLeft from './arrow-left.png';
import MultiSelectDropdown from './MultiSelectDropdown';
import config from './config';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { get, update } from 'lodash';
import { getEmptyUserObj } from './Model/UserModel';




export default function UserCreate({user}) {
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
  const [departments, setDepartments] = useState([]);
  const [userRoles,setUserRoles]=useState([]);
  const[userObjects,setUserObjects]=useState([]);
  const[isUpdate,setIsUpdate]=useState(false);
  const apiUrl = config.apiUrl;
  const getDeptartmentsEndpoint = apiUrl+'/Users/GetDepartmentList';
  const getUserRolesListEndPoint=apiUrl+'/Users/GetRolesList';


  const handleChange = (e) => {
    console.log('handleChange', e.target.name, e.target.value);
    setUserObjects({ ...userObjects, [e.target.name]: e.target.value });
  };

  const fetchDepartments = async () => {
    try { 

      debugger;
      const res = await axios.get(getDeptartmentsEndpoint);
      console.log('Fetching departments in user  registration page ...', res.data);
      // Assuming the API returns an array of department names
      // If it returns objects, adjust accordingly
      setDepartments(res.data);


      const rol=  await axios.get (getUserRolesListEndPoint);
      console.log('Fetching User roles  in user  registration page ...', rol.data);
      // Assuming the API returns an array of department names
      // If it returns objects, adjust accordingly
      setUserRoles(rol.data);

    } catch (err) {
      console.error('Failed to fetch departments , Roles:', err);
    }
  };


     useEffect(() => {
        fetchDepartments();

       if (user && Object.keys(user).length > 0)  {

   /*****************************               EDIT    USER   ************************************************************* */

            const userId = user.userId;
            console.log('Editing user with ID:', userId);
            setIsUpdate(true);   
           
            setUserObjects ( user); // Fetch user details and populate form
                 
              }else 
              { 
  /*********************************              NEW    USER    ******************************************************** */
                      setIsUpdate(false); 
                      setForm({
                                ...form,
                                empId: '',
                                userId: '',
                              });
                      setUserObjects(getEmptyUserObj());
                      setIsUpdate (false);
              }
    }, []);

  const handleChangeDropDown = (selectedOptions) => {
    console.log('Selected:', selectedOptions);
  };

  const validate = () => {
    let errs = {};
    if (!userObjects.empId.trim()) errs.empId = 'Employee ID is required';
    if (!userObjects.userId.trim()) errs.userId = 'User ID is required';
    if (!userObjects.firstName.trim()) errs.firstName = 'First name is required';
    //   if (!form.middleName.trim()) errs.middleName = 'Middle name is required';
    if (!userObjects.lastName.trim()) errs.lastName = 'Last name is required';
    if (!userObjects.mobileNo.match(/^[0-9]{10}$/)) errs.mobileNo = 'Enter valid 10-digit mobile number';
    if (!userObjects.emailId.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.emailId = 'Enter valid email address';
    if (!userObjects.role) errs.role = 'Select a role';
    //   if (!form.reportingManager) errs.reportingManager = 'Select a reportingManager';
    if (!userObjects.password) errs.password = 'Password is required';
    if (userObjects.password !== userObjects.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    //   if (!form.department) errs.department = 'Select a department';
    //  if (!form.branch) errs.branch = 'Select a branch';
    return errs;
  };

  const handleSubmit = async (e) => {

    debugger;
    e.preventDefault();
    console.log('form', form);
    const tempUser=localStorage.getItem('loggedInUser');
    const updatedData = {
      ...userObjects, // your existing form data
      createdBy:tempUser?.user?.userId, // get from localStorage
     
      createdAt: new Date().toISOString(), // current date & time
    };
 console.log("createdBy.....:" , updatedData.createdBy);
    console.log('updated data:', updatedData);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await axios.post(config.apiUrl + '/users', updatedData);
      alert('✅ User created successfully!');
      navigate('/users');
    } catch (error) {
      console.log('error1', error.response.data.errors);
      alert('❌ Failed to create user', error.response.data.errors);
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
            value={userObjects.firstName}
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
            value={userObjects.middleName}
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
            value={userObjects.lastName}
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
            value={userObjects.userId}
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
            value={userObjects.password}
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
            value={userObjects.confirmPassword}
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
            value={userObjects.birthDate}
            onChange={handleChange}
            className='border p-2 rounded w-full'
          />
        </div>

        {/* Mobile */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Mobile No</label>
          <input
            name='mobileNo'
            value={userObjects.mobileNo}
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
            value={userObjects.emailId}
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
            value={userObjects.reportingManager}
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
            value={userObjects.role}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.role ? 'border-red-500' : ''}`}>
            <option value=''>Select Role</option>
             {userRoles.map((rol) => (
              <option key={rol.id} value={(rol.id)}>
                {rol.roleName}
              </option>
            ))}
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
                checked={userObjects.gender === 'Male'}
                onChange={handleChange}
              />{' '}
              Male
            </label>
            <label>
              <input
                type='radio'
                name='gender'
                value='Female'
                checked={userObjects.gender === 'Female'}
                onChange={handleChange}
              />{' '}
              Female
            </label>
          </div>
        </div>

        {/* Department */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Select  Department</label>
          <select
            name='department'
            value={userObjects.department}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${errors.department ? 'border-red-500' : ''}`}>
            <option value=''>Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={(dept.id)}>
                {dept.departmentName}
              </option>
            ))}
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
            value={userObjects.designation}
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
            value={userObjects.joiningDate}
            onChange={handleChange}
            className='border p-2 rounded w-full'
          />
        </div>

        {/* Branch */}
        <div>
          <label className='text-sm font-medium text-gray-700'>Branch</label>
          <select
            name='branch'
            value={userObjects.branch}
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
            value={userObjects.empId}
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
