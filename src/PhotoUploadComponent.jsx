
import React, { useRef } from 'react';
export function PhotoUploadComponent({ setPhotoFile, setPhotoPreview, photoSrc, errorMsg,readOnly=false }) {
    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    // const handlePhotoChange = (event) => {
    //     const file = event.target.files[0];
    //     if (file) {
    //         setPhotoFile(file); // store file for later upload

    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setPhotoPreview(reader.result); // show preview
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

// const handlePhotoChange = (event) => {
//   const file = event.target.files[0];
//   if (!file) return;

//   const reader = new FileReader();
//   reader.onloadend = () => {
//     // reader.result = "data:image/png;base64,..."
//     const base64String = reader.result.split(',')[1]; // remove the "data:image/png;base64," prefix
//     setPhotoFile(base64String); // ✅ only base64 string
//   };
//   reader.readAsDataURL(file);
// };

const handlePhotoChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    debugger;
    const base64String = reader.result.split(',')[1]; // for backend
    setPhotoFile(base64String);       // send this to backend
    setPhotoPreview(reader.result);   // preview in <img>
  };
  reader.readAsDataURL(file); // gives full data URL for preview
};

    return (
        <div className='flex flex-col items-center space-y-2'>
            <div className='w-32 h-32 rounded-full overflow-hidden border flex items-center justify-center bg-gray-200'>
                {!photoSrc ? <span className='text-gray-600'>Photo</span> :
                <img src={photoSrc} alt='User Avatar' className='w-full h-full object-cover' />}
            </div>
 {readOnly && !photoSrc && <p className='text-gray-500 text-sm'>No photo available</p>}     
            {!readOnly &&(
            <button type="button" onClick={handleClick} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                Upload Photo
            </button>)}
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoChange} className="hidden"/>
            {errorMsg && <p className='text-red-600 text-sm'>{errorMsg}</p>}
        </div>
    );
}
