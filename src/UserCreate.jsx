import { useState } from "react";
import ArrowLeft from "./arrow-left.png";
import MultiSelectDropdown from "./MultiSelectDropdown";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function UserCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    empId: "",
    userId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    email: "",
    reportingManager: "",
    gender: "Male",
    role: "",
    password: "",
    confirmPassword: "",
    dept: "",
    designation: "",
    birthDate: "",
    joinDate: "",
    branch: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const options = ["Select Department", "Holiday", "Air Ticketing", "Visa"];

  const handleChangeDropDown = (selectedOptions) => {
    console.log("Selected:", selectedOptions);
  };

  const validate = () => {
    let errs = {};
    if (!form.empId.trim()) errs.empId = "Employee ID is required";
    if (!form.userId.trim()) errs.userId = "User ID is required";
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.middleName.trim()) errs.middleName = "Middle name is required";
    if (!form.lastName.trim()) errs.lastName = "Last name is required";
    if (!form.mobile.match(/^[0-9]{10}$/))
      errs.mobile = "Enter valid 10-digit mobile number";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.email = "Enter valid email address";
    if (!form.role) errs.role = "Select a role";
     if (!form.reportingManager) errs.reportingManager = "Select a reportingManager";
    if (!form.password) errs.password = "Password is required";
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (!form.dept) errs.dept = "Select a department";
    if (!form.branch) errs.branch = "Select a branch";
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
      await axios.post("http://localhost:5000/api/users", form);
      alert("✅ User created successfully!");
      navigate("/users");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to create user");
    }
  };

  return (
    <div className="max-w-8xl mx-auto bg-white p-6 shadow rounded-lg">
      {/* Header */}
      <div className="flex items-center gap-x-4 mb-6">
        <Link to="/users">
          <img
            src={ArrowLeft}
            alt="Back arrow"
            className="h-6 w-6 inline-block"
          />
        </Link>
        <h2 className="text-2xl font-bold">New User Registration</h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className={`border p-2 rounded w-full ${errors.firstName ? "border-red-500" : ""
            }`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
        </div>

        
        
        {/* Middle Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Middle Name
          </label>
          <input
            name="middleName"
            value={form.middleName}
            onChange={handleChange}
            placeholder="Middle Name"
            className={`border p-2 rounded w-full ${ errors.middleName ? "border-red-500" : ""
            }`}
          />
          {errors.middleName && (
            <p className="text-red-500 text-sm">{errors.middleName}</p>
          )}
        </div>

        

        {/* Last Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">Last Name</label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className={`border p-2 rounded w-full ${
              errors.lastName ? "border-red-500" : ""
            }`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
        </div>
        

       {/* User ID */}
        <div>
          <label
            htmlFor="userId"
            className="text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            User ID
          </label>
          <input
            id="userId"
            name="userId"
            value={form.userId}
            onChange={handleChange}
            placeholder="User ID"
            className={`border p-2 rounded w-full ${
              errors.userId ? "border-red-500" : ""
            }`}
          />
          {errors.userId && (
            <p className="text-red-500 text-sm">{errors.userId}</p>
          )}
        </div>

         {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className={`border p-2 rounded w-full ${
              errors.password ? "border-red-500" : ""
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

         {/* Confirm Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={`border p-2 rounded w-full ${
              errors.confirmPassword ? "border-red-500" : ""
            }`}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Birth Date */}
        <div>
          <label className="text-sm font-medium text-gray-700">Birth Date</label>
          <input
            type="date"
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="text-sm font-medium text-gray-700">Mobile No</label>
          <input
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Mobile No"
            className={`border p-2 rounded w-full ${
              errors.mobile ? "border-red-500" : ""
            }`}
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm">{errors.mobile}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">Email ID</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email ID"
            className={`border p-2 rounded w-full ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

      
        {/* Reporting Manager */}
        <div>
          <label className="text-sm font-medium text-gray-700">Reporting Manager</label>
          <select
            name="reportingManage"
            value={form.reportingManage}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${
              errors.reportingManage ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Manager</option>
            <option value="01">Shreedev Hole</option>
            <option value="02">Minal Joshi</option>
            <option value="03">Vishvesh</option>
          </select>
          {errors.reportingManage && <p className="text-red-500 text-sm">{errors.reportingManage}</p>}
        </div>

        
        {/* Role */}
        <div>
          <label className="text-sm font-medium text-gray-700">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${
              errors.role ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
        </div>

       {/* Gender */}
        <div>
          <label className="text-sm font-medium text-gray-700">Gender</label>
          <div className="flex items-center gap-4 mt-1">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={form.gender === "Male"}
                onChange={handleChange}
              />{" "}
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={form.gender === "Female"}
                onChange={handleChange}
              />{" "}
              Female
            </label>
          </div>
        </div>

       

        {/* Department */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Department
          </label>
          <MultiSelectDropdown
            options={options}
            onChange={handleChangeDropDown}
            placeholder="Select Department"
          />
          {errors.dept && <p className="text-red-500 text-sm">{errors.dept}</p>}
        </div>

        {/* Designation */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Designation
          </label>
          <input
            name="designation"
            value={form.designation}
            onChange={handleChange}
            placeholder="Designation"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Date of Joining */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Date of Joining
          </label>
          <input
            type="date"
            name="joinDate"
            value={form.joinDate}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Branch */}
        <div>
          <label className="text-sm font-medium text-gray-700">Branch</label>
          <select
            name="branch"
            value={form.branch}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${
              errors.branch ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Branch</option>
            <option value="Pune HO">Pune HO</option>
            <option value="PCMC">PCMC</option>
            <option value="Nashik">Nashik</option>
          </select>
          {errors.branch && (
            <p className="text-red-500 text-sm">{errors.branch}</p>
          )}
        </div>

        {/* Employee ID */}
        <div>
          <label
            htmlFor="empId"
            className="text-sm font-medium text-gray-700 whitespace-nowrap"
          >
            Employee ID
          </label>
          <input
            id="empId"
            name="empId"
            value={form.empId}
            onChange={handleChange}
            placeholder="Employee ID"
            className={`border p-2 rounded w-full ${
              errors.empId ? "border-red-500" : ""
            }`}
          />
          {errors.empId && (
            <p className="text-red-500 text-sm">{errors.empId}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-3 flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save User
          </button>
        </div>
      </form>
    </div>
  );
}
