import { useEffect, useState } from 'react';
import ArrowLeft from './arrow-left.png';
import MultiSelectDropdown from './MultiSelectDropdown';
import config from './config';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { cloneDeep, get, set, update } from 'lodash';
import { getEmptyUserObj } from './Model/UserModel';
import { useLocation } from 'react-router-dom';
import React from 'react';
import { useGetSessionUser } from './SessionContext';
import { Eye, EyeOff, User } from "lucide-react";
import userStatusSelector from './UserStatusSelecter';
import UserStatusSelector from './UserStatusSelecter';
import { useRef } from 'react';
import { PhotoUploadComponent } from './PhotoUploadComponent';
import { PasswordField } from './PasswordConfirmationComponent';




export default function UserCreate({ }) {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [btnText, setbtnText] = useState("Creat User");
  const [cancelBtnText, setCancelBtnText] = useState("Cancel");
  //const [userObjects, setUserObjects] = useState(() => user || getEmptyUserObj());
  //const[isUpdate,setIsUpdate]=useState(false);
  const apiUrl = config.apiUrl;
  const getDeptartmentsEndpoint = apiUrl + '/Users/GetDepartmentList';
  const getUserRolesListEndPoint = apiUrl + '/Users/GetRolesList';
  const updateUserAPI = apiUrl + '/Users/UpdateUser';
   const createUserAPI = apiUrl + '/Users/CreateUser';
   const sendCredantialsAPI= apiUrl + "/Contact/SendLoginInformation";
  const location = useLocation(); // ✅ get location here

  const user = location.state?.user || getEmptyUserObj();
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState('');

  // Initialize your state with the user object
  const [userObjects, setUserObjects] = useState(user);
  const [isUpdate, setIsUpdate] = useState(!!location.state?.user);
  const [axiosMsgData, setData] = useState("");
  const { user: sessionUser } = useGetSessionUser();
  const [photo, setPhoto] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null); // store base64 for UI preview
  


  useEffect(() => {
    console.log("Setting User Objects...", userObjects);
    console.log("Location object..", location);
    debugger;
    if (location.state?.user) {
      setIsUpdate(true);
       if (user.photoBase64) {
      setPhoto(`data:image/jpeg;base64,${user.photoBase64}`);
      setPhotoPreview(`data:image/jpeg;base64,${user.photoBase64}`);
      console.log("Photo set for preview:", user.photoBase64);
    }
      console.log("User to edit:", userObjects);
      setbtnText("Update User");
    }
    else {
      setIsUpdate(false);
    }
  }, [user, userObjects]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Invalid file type. Please select an image.");
      setPhoto(null);
      return;
    }

    // Validate file size
    if (file.size > 1024 * 1024) {
      setErrorMsg("File size must be below 1 MB");
      setPhoto(null);
      return;
    }

    setErrorMsg("");
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };


  const handleChange = (e) => {
    console.log('handleChange', e.target.name, e.target.value);
    debugger;
    if (e.target.name == "password") {

      setPassword(e.target.value)

      //  if(password!=null || password!='')
      //    setShow(true);
      //   else
      //     setShow(false);
    }
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


      const rol = await axios.get(getUserRolesListEndPoint);
      console.log('Fetching User roles  in user  registration page ...', rol.data);
      // Assuming the API returns an array of department names
      // If it returns objects, adjust accordingly
      setUserRoles(rol.data);

    } catch (err) {
      console.error('Failed to fetch departments , Roles:', err);
    }
  };


  useEffect(() => {

    console.log("Entry into UserCreate........");
    fetchDepartments();

    if (user && Object.keys(user).length > 0) {

      /*****************************               EDIT    USER   ************************************************************* */

      const userId = user.userId;
      console.log('Editing user with ID:', userId);
      setIsUpdate(true);
      setPhoto(user.PhotoBase64 ? `data:image/jpeg;base64,${user.PhotoBase64}` : null);
      setUserObjects(user); // Fetch user details and populate form
    } else {
      /*********************************              NEW    USER    ******************************************************** */
      setIsUpdate(false);
      // setForm({
      //   ...form,
      //   empId: '',
      //   userId: '',
      // });
      setUserObjects(getEmptyUserObj());
      setIsUpdate(false);
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
    //console.log('form', form);
    const tempUser = localStorage.getItem('loggedInUser');
    const updatedData = {
      ...userObjects, // your existing form data
      createdBy: tempUser?.user?.userId, // get from localStorage

      createdAt: new Date().toISOString(), // current date & time
    };
    console.log("createdBy.....:", updatedData.createdBy);
    console.log('updated data:', updatedData);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      //return;
    }
   

try {
  if (!isUpdate) {
    // await axios.post(config.apiUrl + '/users/', updatedData, {
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${sessionUser.token}`,
    //   },
    // });

    await createUser(updatedData, photo);
    await SendLoginCreadentials(updatedData);
    
    navigate("/users");
    // alert('✅ User created successfully!');
    // navigate('/users');
  } else {
 
    await saveUser(updatedData, photo);}
    debugger;
    await SendLoginCreadentials(updatedData);
     navigate("/users");

} catch (error) {
  console.error(error);
  const message =
    error.response?.data?.errors ||
    error.response?.data?.title ||
    error.message;
  alert(`❌ Failed: ${JSON.stringify(message)}`);
  setData(message);
}
    console.log("Axios message data:", axiosMsgData);

  };





const createUser = async (updatedData, selectedFile = null) => {
  try {
    //const formData = new FormData();
debugger;
    // append all user fields
    // for (let key in updatedData) {
    //   if (updatedData[key] !== undefined && updatedData[key] !== null) {
    //     formData.append(key, updatedData[key]);
    //   }
    // }

    // append photo if exists
       // keep old if no new file
    const payload = { ...userObjects, PhotoBase64: photo || userObjects.PhotoBase64 };
    
    const response = await axios.post(createUserAPI, payload, {
      headers: {
        Authorization: `Bearer ${sessionUser.token}`,
        "Content-Type": "application/json",
      },
    });

    alert("✅ User created successfully!");
  
    console.log("User created", response.data);

  } catch (error) {
    console.error(error);
    const message = error.response?.data?.errors || error.response?.data?.title || error.message;
    alert(`❌ Failed: ${JSON.stringify(message)}`);
  }
};



const SendLoginCreadentials  = async (updatedData, selectedFile = null) => {
  try {
debugger;

 const receiverId=updatedData.userId;
 const senderId=sessionUser.user.userId;
  
 debugger;
 const response = await axios.post(
  sendCredantialsAPI,
  updatedData,  // full Users object as JSON body
  {
    headers: {
      Authorization: `Bearer ${sessionUser.token}`,
      "Content-Type": "application/json"
    }
  }
);

    alert("✅ Credentials sent successfully!");
  
    console.log("Credentials sent successfully", response.data);

  } catch (error) {
    console.error(error);
    const message = error.response?.data?.errors || error.response?.data?.title || error.message;
    alert(`❌ Failed: ${JSON.stringify(message)}`);
  }
};


  

const saveUser = async (updatedData, selectedFile = null) => {
  try {
    //const formData = new FormData();
debugger;
    // append all user fields
    // for (let key in updatedData) {
    //   if (updatedData[key] !== undefined && updatedData[key] !== null) {
    //     formData.append(key, updatedData[key]);
    //   }
    // }

    // append photo if exists
       // keep old if no new file
    const payload = { ...userObjects, PhotoBase64: photo || userObjects.PhotoBase64 };
    
    const response = await axios.put(updateUserAPI, payload, {
      headers: {
        Authorization: `Bearer ${sessionUser.token}`,
        "Content-Type": "application/json",
      },
    });


    alert("✅ User saved successfully!");
   
    console.log("User saved", response.data);

  } catch (error) {
    console.error(error);
    const message = error.response?.data?.errors || error.response?.data?.title || error.message;
    alert(`❌ Failed: ${JSON.stringify(message)}`);
  }
};

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleCancelSubmit = (e) => {

    debugger;

    navigate('/users');
    e.preventDefault();

  }

  return (
    <div className='max-w-8xl mx-auto bg-white p-6 shadow rounded-lg'>
      <div className="relative">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* First row: title and photo */}
          <div className="col-span-3 flex items-center justify-between mb-4">
            {/* Title centered */}
            <div className="flex-1 text-center">
              <h2 className="text-2xl font-bold">New User Registration</h2>
            </div>
            {/* Place photo upload on top right corner */}
            <div className="col-start-3 row-start-1 flex justify-end">
             <PhotoUploadComponent
    setPhotoFile={setPhoto}       // store the File object
    setPhotoPreview={setPhotoPreview} // store base64 for preview
    photoSrc={photoPreview}
    errorMsg={errorMsg}
/>
            </div>
          </div>
          {/* Form fields */}
          <div className="col-span-3 row-start-2 grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div >
              <PasswordField setUserObject={setUserObjects} isUpdate={isUpdate}   ></PasswordField>
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
                className={`border p-2 rounded w-full ${errors.reportingManager ? 'border-red-500' : ''
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
            <div>
              <label className='text-sm font-medium text-gray-700'>Status</label>
              <UserStatusSelector

                status={userObjects.status}
                onStatusChange={(newStatus) => setUserObjects({ ...userObjects, status: newStatus })}
                onUpdate={() => { }}
                isUpdate={isUpdate}
              />

            </div>

            <div className="md:col-span-3 flex justify-end items-end mt-4 space-x-3">
              {/* Cancel Button */}
              <button
                type="button" // should be button to avoid triggering form submit
                onClick={handleCancelSubmit}
                className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
              >
                {cancelBtnText}
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                {btnText}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
