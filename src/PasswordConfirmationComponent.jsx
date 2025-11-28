import { useState } from "react";
import { UserObject } from "./Model/UserModel";

 export function PasswordField({ setUserObject, isUpdate }) {
  const [changePassword, setChangePassword] = useState(!isUpdate);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmBox, setShowConfirmBox] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    debugger;
    if (name === 'password') {
      setPassword(value);
      if (confirmPassword && value !== confirmPassword) {
        debugger;
        setErrors(prev => ({ ...prev, password: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, password: '' }));
      }
      if (value === confirmPassword) setUserObject(prev => ({ ...prev, password: value }));
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
      if (password && value !== password) {
        debugger;
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
        setErrors(prev => ({ ...prev, password: '' }));
        setUserObject(prev => ({ ...prev, password: value }));
        
        setUserObject(prev => ({ ...prev, isUpdatepasword: true }));
        console.log("Password set in user object");
      }
    }
  };

  const handleUpdateClick = () => {
    setShowConfirmBox(true);
  };

  const confirmYes = () => {
    setChangePassword(true);
    setShowConfirmBox(false);
  };

  const confirmNo = () => {
    setShowConfirmBox(false);
  };

  return (
    <div className='flex flex-col space-y-4 items-center justify-center w-full h-full'>
      {isUpdate && !changePassword && !showConfirmBox && (
        <div className='flex items-center justify-center '>
          <button 
            type='button' 
            className='border border-gray-300 bg-gray-100 text-gray-800 px-4 py-2 
            rounded text-sm 
            font-medium hover:bg-gray-200 
            flex items-center justify-center
             max-w-xs '
            title='Click here to change password'
            onClick={handleUpdateClick}
          >
            Update Password
          </button>
        </div>
      )}

      {showConfirmBox && (
        <div className='bg-gray-50 p-2 rounded border border-gray-300  max-w-md  flex flex-col items-center flex items-center justify-center'>
          <p className='mb-3 text-gray-800 text-center'>Are you sure you want to change the password?</p>
          <div className='flex space-x-2 justify-center'>
            <button 
              className='border border-blue-600 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm' 
              onClick={confirmYes}
            >Yes</button>
            <button 
              className='border border-blue-400 bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 text-sm' 
              onClick={confirmNo}
            >No</button>
          </div>
        </div>
      )}

      {(changePassword || !isUpdate) && (
        <div className='flex space-x-4 w-full h-full'>
          {/* Password */}
          <div className="flex-1 flex flex-col relative h-full">
            <label className='text-sm font-medium text-gray-700 mb-1'>Password
              <span className="text-red-500 text-lg leading-none"> *</span>
            </label>
            <div className='relative w-full h-full'>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={password}
                onChange={handleChange}
                placeholder='Password'
                // className={`border p-2 rounded w-full h-full ${errors.password ? 'border-red-500' : ''}`}
                className={`border-highlight ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm'
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="flex-1 flex flex-col h-full">
            <label className='text-sm font-medium text-gray-700 mb-1'>Confirm Password
              <span className="text-red-500 text-lg leading-none"> *</span>
            </label>
            <input
              type='password'
              name='confirmPassword'
              value={confirmPassword}
              onChange={handleChange}
              placeholder='Confirm Password'
              // className={`border p-2 rounded w-full h-full ${errors.confirmPassword ? 'border-red-500' : ''}`}
              className={`border-highlight ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            {errors.confirmPassword && <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// export default function PasswordForm() {
//   const [userObject, setUserObject] = useState({});
//   const [isUpdate, setIsUpdate] = useState(true);

//   return (
//     <div className='p-4'>
//       <h2 className='text-2xl font-bold mb-4'>New User Registration</h2>
//       <PasswordField 
//         setUserObject={setUserObject} 
//         isUpdate={isUpdate} 
//       />
//     </div>
//   );
// }