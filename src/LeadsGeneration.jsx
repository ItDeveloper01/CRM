import PhoneField from './PhoneInput';
import { useState } from 'react';

export default function LeadForm() {
  const [category, setCategory] = useState('');
  const [enquirySource, setEnquirySource] = useState('');
  const [enquiryMode, setEnquiryMode] = useState('');
  const [holidayType, setHolidayType] = useState('');
  const [holidayCategory, setHolidayCategory] = useState('');
  const [formData, setFormData] = useState({});

  const [countries, setCountries] = useState([]);

  const [errors, setErrors] = useState({});

  const categories = [
    'Holiday',
    'Visa',
    'MICE',
    'Air Ticketing',
    'Car Rentals',
    'Rail Pass',
    'Hotel Booking',
    'Only Sightseeing',
  ];
  const enquirySources = [
    'Referred by client',
    'Repeat Guest',
    'Paper Advt',
    'Paper Advt-Sakal',
    'Paper Advt-Maharashtra Times',
    'Paper Advt-Loksatta',
    'Paper Advt-Lokmat',
    'Paper Advt-TOI',
    'Paper Advt-Others',
    'Corporate',
    'Other',
    'Website',
    'Social Media',
  ];
  const enquiryModes = ['WalkIn', 'Telephonic', 'Email', 'Social Media'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderCategoryFields = () => {
    if (category === 'Holiday') {
      if (holidayType === 'GIT') {
        return (
          <>
            <label className='font-medium text-gray-700 mb-1 block'>Destination</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='destination'
              placeholder='Destination'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>Travel Dates</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='travelDates'
              type='date'
              onChange={handleChange}
            />
          </>
        );
      } else if (holidayType === 'FIT') {
        return (
          <>
            <label className='font-medium text-gray-700 mb-1 block'>Destinations</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='destinations'
              placeholder='Destinations'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>Budget</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='budget'
              placeholder='Budget'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>Preferences</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='preferences'
              placeholder='Preferences'
              onChange={handleChange}
            />
          </>
        );
      }
    }

    switch (category) {
      case 'Holiday':
        return (
          <>
            <div className='flex gap-4'>
              {/* Travel Date */}
              <div className='flex flex-col flex-1'>
                <label className='font-medium text-gray-700 mb-1'>Travel Date</label>
                <input
                  className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                  name='travelDate'
                  type='date'
                  placeholder='Travel Date'
                  onChange={handleChange}
                />
              </div>

              {/* Destination */}
              <div className='flex flex-col flex-1'>
                <label className='font-medium text-gray-700 mb-1'>Destination</label>
                <input
                  className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                  name='destinations'
                  placeholder='Destinations'
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='flex gap-4 mt-4'>
              {/* No of Adults */}
              <div className='flex flex-col flex-1'>
                <label className='font-medium text-gray-700 mb-1'>No of Adults</label>
                <input
                  type='number'
                  className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                  name='noOfAdults'
                  placeholder='Adults'
                  onChange={handleChange}
                />
              </div>

              {/* No of Children */}
              <div className='flex flex-col flex-1'>
                <label className='font-medium text-gray-700 mb-1'>No of Children</label>
                <input
                  type='number'
                  className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                  name='noOfChildren'
                  placeholder='Children'
                  onChange={handleChange}
                />
              </div>

              {/* No of Infants */}
              <div className='flex flex-col flex-1'>
                <label className='font-medium text-gray-700 mb-1'>No of Infants</label>
                <input
                  type='number'
                  className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
                  name='noOfInfants'
                  placeholder='Infants'
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='flex gap-4 mt-4'>
              <label className='font-medium text-gray-700 mb-1 block'>Notes</label>
              <input
                className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
                name='notes'
                placeholder='Notes'
                onChange={handleChange}
              />
            </div>
          </>
        );
      case 'Visa':
        return (
          <>
            <label className='font-medium text-gray-700 mb-1 block'>Country</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='country'
              placeholder='Country'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>Visa Type</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='visaType'
              placeholder='Visa Type'
              onChange={handleChange}
            />

            {/* <label className='font-medium text-gray-700 mb-1 block'>Travel Date</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='travelDate'
              type='date'
              onChange={handleChange}
            /> */}
          </>
        );
      case 'MICE':
        return (
          <>
            {/* <label className='font-medium text-gray-700 mb-1 block'>Destination</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='destination'
              placeholder='Destination'
              onChange={handleChange}
            /> */}

            <label className='font-medium text-gray-700 mb-1 block'>No. of Participants</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='participants'
              type='number'
              placeholder='No. of Participants'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>Event Type</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='eventType'
              placeholder='Event Type'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>Event Date</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='eventDate'
              type='date'
              onChange={handleChange}
            />
          </>
        );
      case 'Air Ticketing':
        return (
          <>
            <label className='font-medium text-gray-700 mb-1 block'>From</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='from'
              placeholder='From'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>To</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='to'
              placeholder='To'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>Departure Date</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='departureDate'
              type='date'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>Return Date</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='returnDate'
              type='date'
              onChange={handleChange}
            />
          </>
        );
      case 'Car Rentals':
        return (
          <>
            <label className='font-medium text-gray-700 mb-1 block'>Pickup Location</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='pickupLocation'
              placeholder='Pickup Location'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>Drop Location</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='dropLocation'
              placeholder='Drop Location'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>Start Date</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='startDate'
              type='date'
              onChange={handleChange}
            />

            <label className='font-medium text-gray-700 mb-1 block'>End Date</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='endDate'
              type='date'
              onChange={handleChange}
            />
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    console.log('Lead Data:', { category, holidayType, ...formData });
  };

  return (
    <div className='max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl'>
      <h2 className='text-2xl font-bold mb-6 text-center text-blue-600'>Travel Lead Form</h2>
      {/* Customer Details Section */}
      <div className='border border-gray-300 bg-gray-50 rounded-lg p-4 mb-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4 border-b pb-2'>Customer Details</h3>

        <div className='flex gap-4 mb-4'>
          {/* Mobile Number */}
          <div className='flex flex-col flex-1'>
            <label className='font-medium text-gray-700 mb-1'>Mobile Number</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='phone'
              placeholder='Mobile Number'
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className='flex flex-col flex-1'>
            <label className='font-medium text-gray-700 mb-1'>Email</label>
            <input
              className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='email'
              type='email'
              placeholder='Email Address'
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Title + Name Fields in One Row */}
        <div className='flex gap-4 mb-4'>
          {/* Title */}
          <div className='flex flex-col w-28'>
            <label className='font-medium text-gray-700 mb-1'>Title</label>
            <select
              className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='title'
              onChange={handleChange}>
              <option value=''>Title</option>
              <option value='Mr.'>Mr.</option>
              <option value='Mrs.'>Mrs.</option>
              <option value='Ms.'>Ms.</option>
              <option value='Dr.'>Dr.</option>
              <option value='Prof.'>Prof.</option>
            </select>
          </div>

          {/* First Name */}
          <div className='flex flex-col flex-1'>
            <label className='font-medium text-gray-700 mb-1'>First Name</label>
            <input
              className='border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='firstName'
              placeholder='First Name'
              onChange={handleChange}
            />
          </div>

          {/* Last Name */}
          <div className='flex flex-col flex-1'>
            <label className='font-medium text-gray-700 mb-1'>Last Name</label>
            <input
              className='border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='lastName'
              placeholder='Last Name'
              onChange={handleChange}
            />
          </div>

          {/* Middle Name */}
          <div className='flex flex-col flex-1'>
            <label className='font-medium text-gray-700 mb-1'>Middle Name</label>
            <input
              className='border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
              name='middleName'
              placeholder='Middle Name'
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <h3 className='text-lg font-semibold text-gray-800 mb-4 border-b pb-2'>Leads Details</h3>
      <div className='flex gap-4'>
        {/* Category */}
        <div className='flex flex-col flex-1'>
          <label className='font-medium text-gray-700 mb-1'>Category</label>
          <select
            className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setHolidayType('');
            }}>
            <option value=''>Select Category</option>
            {categories.map((cat) => (
              <option
                key={cat}
                value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Email */}
        <div className='flex flex-col flex-1'>
          <label className='font-medium text-gray-700 mb-1'>Enquiry mode</label>
          <select
            className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={enquiryMode}
            onChange={(e) => {
              setEnquiryMode(e.target.value);
              setHolidayType('');
            }}>
            <option value=''>Select Mode</option>
            {enquiryModes.map((cat) => (
              <option
                key={cat}
                value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Phone */}
        <div className='flex flex-col flex-1'>
          <label className='font-medium text-gray-700 mb-1'>Enquiry Source</label>
          <select
            className='w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={enquirySource}
            onChange={(e) => {
              setEnquirySource(e.target.value);
              setHolidayType('');
            }}>
            <option value=''>Select Source</option>
            {enquirySources.map((cat) => (
              <option
                key={cat}
                value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Conditional fields */}
      {category === 'Holiday' && (
        <>
          <label className='font-medium text-gray-700 mb-1'>Holiday Type</label>
          <select
            className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={holidayType}
            onChange={(e) => setHolidayType(e.target.value)}>
            <option value=''>Select Holiday Type</option>

            <option value='INT-FIT'>International FIT</option>
            <option value='DOM-FIT'>Domestic FIT</option>
            <option value='INT-GIT'>International GIT</option>
            <option value='DOM-GIT'>Domestic GIT</option>
          </select>

          <label className='font-medium text-gray-700 mb-1'>Holiday Category</label>
          <select
            className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={holidayCategory}
            onChange={(e) => setHolidayCategory(e.target.value)}>
            <option value=''>Select Holiday Category</option>
            <option value='INT'>International</option>
            <option value='DOM'>Domestic</option>
          </select>
        </>
      )}

      {category === 'Car Rentals' && (
        <>
          <label className='font-medium text-gray-700 mb-1'>Vehicle Category</label>
          <select
            className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={holidayType}
            onChange={(e) => setHolidayType(e.target.value)}>
            <option value=''>Select Vehicle Category</option>
            <option value='Car'>Car</option>
            <option value='Coaches'>Coaches</option>
          </select>

          <label className='font-medium text-gray-700 mb-1'>Vehicle Model</label>
          <select
            className='w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
            value={holidayCategory}
            onChange={(e) => setHolidayCategory(e.target.value)}>
            <option value=''>Select Vehicle Model</option>
            <option value='INT'>Volvo 45 Seater</option>
            <option value='DOM'>Domestic</option>
          </select>
        </>
      )}

      {renderCategoryFields()}

      <button
        onClick={handleSubmit}
        className='justify-between items-center mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition'>
        Submit Lead
      </button>
    </div>
  );
}
