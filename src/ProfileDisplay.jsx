import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PhotoUploadComponent } from './PhotoUploadComponent';
import 'tailwindcss/tailwind.css';
import { useGetSessionUser, useSetSessionUser } from './SessionContext';
import { getEmptyUserObj } from './Model/UserModel';


export default function ProfileDisplay() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: sessionUser } = useGetSessionUser();
  const user = location.state?.user || sessionUser || getEmptyUserObj();

  const [userObjects, setUserObjects] = useState(user.userObj || getEmptyUserObj());
  const   [photoPreviewSrc , setPhotoPreview] = useState(null);

  const handleBack = () => navigate("/dashboard");



   useEffect(() => {
    // This runs only once on first render
    initializePhotoPreview();
    console.log("User Objects on first render:", userObjects);
    console.log("User on first render:", user);
  }, []); // empty array means "run once"

  const initializePhotoPreview = () => {
    debugger;
    if (userObjects?.photoBase64) {
      console.log("Photo Base64 on first render:", userObjects.photoBase64);

      const ard = `data:${detectMimeType(userObjects.photoBase64)};base64,${userObjects.photoBase64}`;
      setPhotoPreview(ard);
      console.log("Photo preview set to: ", ard);
      // You can set state here if needed
      // setPhotoPreview(`data:image/jpeg;base64,${userObjects.PhotoBase64}`);
    }
  };

  // Detect MIME type from base64 prefix
  const detectMimeType = (b64) => {
debugger;

    if (!b64) return "image/jpeg"; // default
    if (b64.startsWith("/9j/")) return "image/jpeg";
    if (b64.startsWith("iVBOR")) return "image/png";
    if (b64.startsWith("R0lG")) return "image/gif";
    if (b64.startsWith("PHN2Zy")) return "image/svg+xml";
    return "image/jpeg"; // fallback
  };
const setPhotoPreviewFunc= (preview) => {
  // This function can be used if you want to set photo preview state
  // Currently not used as photoPreviewSrc is derived directly
const ard = userObjects.photoBase64
    ? `data:${detectMimeType(userObjects.photoBase64)};base64,${userObjects.photoBase64}`
    : null;

    setPhotoPreview(ard);
    console.log("Photo preview set to: ", ard);
}
  
  const renderField = (label, value) => (
    
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-800">{value || "-"}</p>
    </div>
  );

  // const photoPreview = user.userObj.PhotoBase64
  //   ? `data:image/jpeg;base64,${user.userObj.PhotoBase64}`
  //   : null;

 return (
  <div className="w-full h-full flex justify-center items-start bg-gray-100">
  <div className="w-full max-w-4xl bg-white shadow rounded-lg flex flex-col h-full">
      
      {/* Header - fixed at top */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-2xl font-bold">User Profile</h2>
        <button
          onClick={handleBack}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" >
          Back
        </button>
      </div>

      {/* Content - scrollable */}
      <div className="flex flex-col overflow-auto p-6 flex-1">
        
        {/* Photo */}
        <div className="flex justify-center mb-6">
          <PhotoUploadComponent photoSrc={photoPreviewSrc} readOnly={true} />
        </div>

        {/* User Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderField("First Name", userObjects.firstName)}
          {renderField("Middle Name", userObjects.middleName)}
          {renderField("Last Name", userObjects.lastName)}
          {renderField("User ID", userObjects.userId)}
          {renderField("Birth Date", userObjects.birthDate)}
          {renderField("Mobile No", userObjects.mobileNo)}
          {renderField("Email ID", userObjects.emailId)}
          {renderField("Reporting Manager", userObjects.reportingManager)}
          {renderField("Role", user.role)}
          {renderField("Gender", userObjects.gender)}
          {renderField("Department", userObjects.department)}
          {renderField("Designation", userObjects.designation)}
          {renderField("Date of Joining", userObjects.joiningDate)}
          {renderField("Branch", userObjects.branch)}
          {renderField("Employee ID", userObjects.empId)}
          {renderField("Status", userObjects.status)}
          {renderField("Password", "********")}
        </div>
      </div>
    </div>
  </div>
);

}
