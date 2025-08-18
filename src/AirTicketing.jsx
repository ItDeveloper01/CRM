import React, { useMemo, useState, useEffect } from 'react';

const airports = [
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj' },
  { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi' },
  { code: 'BLR', city: 'Bengaluru', name: 'Kempegowda' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai Intl' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi' },
  { code: 'PNQ', city: 'Pune', name: 'Lohegaon' },
  { code: 'GOI', city: 'Goa', name: 'Mopa/Dabolim' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra' },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel' },
  { code: 'JAI', city: 'Jaipur', name: 'Jaipur Intl' },
];

const airlines = [
  { code: 'AI', name: 'Air India' },
  { code: '6E', name: 'IndiGo' },
  { code: 'UK', name: 'Vistara' },
  { code: 'G8', name: 'Go First' },
  { code: 'SG', name: 'SpiceJet' },
];

function Field({ label, children }) {
  return (
    <div className='flex flex-col gap-1'>
      <label className='text-sm text-gray-600 font-medium'>{label}</label>
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={
        'w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ' +
        (props.className || '')
      }
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className={
        'w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white ' +
        (props.className || '')
      }
    />
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-sm ${
        active
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white border-gray-300 hover:bg-gray-50'
      }`}>
      {children}
    </button>
  );
}

export default function AirTicketingScreen() {
  const today = new Date().toISOString().slice(0, 10);
  const [tripType, setTripType] = useState('oneway'); // one way | roundtrip | multicity
  const [segments, setSegments] = useState([{ from: 'BOM', to: 'DEL', departDate: today }]);
  const [form, setForm] = useState({
    cabin: 'Economy',
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);

  const totalPax = form.adults + form.children + form.infants;

  const canSearch = useMemo(() => {
    return segments.every((s) => s.from && s.to && s.from !== s.to && s.departDate) && totalPax > 0;
  }, [segments, totalPax]);

  function updateSegment(index, key, value) {
    setSegments((prev) => prev.map((s, i) => (i === index ? { ...s, [key]: value } : s)));
  }

  function addSegment() {
    setSegments((prev) => [...prev, { from: '', to: '', departDate: today }]);
  }

  return (
    <div className=''>
      <div className='max-w-6xl mx-auto px-4 py-4'>
        <div className='shadow p-4 md:p-6'>
          <div className='flex flex-wrap items-center gap-2 mb-4'>
            <Chip
              active={tripType === 'oneway'}
              onClick={() => setTripType('oneway')}>
              One‑way
            </Chip>
            <Chip
              active={tripType === 'roundtrip'}
              onClick={() => setTripType('roundtrip')}>
              Round‑trip
            </Chip>
            <Chip
              active={tripType === 'multicity'}
              onClick={() => setTripType('multicity')}>
              Multi‑city
            </Chip>
          </div>

          {segments.map((seg, i) => (
            <div
              key={i}
              className='grid grid-cols-1 md:grid-cols-12 gap-3 mb-4'>
              <div className='md:col-span-4'>
                <Field label='From'>
                  <Input
                    value={seg.from}
                    onChange={(e) => updateSegment(i, 'from', e.target.value.toUpperCase())}
                  />
                </Field>
              </div>
              <div className='md:col-span-4'>
                <Field label='To'>
                  <Input
                    value={seg.to}
                    onChange={(e) => updateSegment(i, 'to', e.target.value.toUpperCase())}
                  />
                </Field>
              </div>
              <div className='md:col-span-4'>
                <Field label='Departure'>
                  <Input
                    type='date'
                    value={seg.departDate}
                    onChange={(e) => updateSegment(i, 'departDate', e.target.value)}
                  />
                </Field>
              </div>
            </div>
          ))}

          {tripType === 'multicity' && (
            <button
              onClick={addSegment}
              className='px-4 py-2 mb-4 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-50'>
              + Add Segment
            </button>
          )}

          <div className='grid grid-cols-3 gap-3'>
            <Field label='Adults'>
              <Input
                type='number'
                min={1}
                max={9}
                value={form.adults}
                onChange={(e) => setForm({ ...form, adults: Number(e.target.value) })}
              />
            </Field>
            <Field label='Children'>
              <Input
                type='number'
                min={0}
                max={9}
                value={form.children}
                onChange={(e) => setForm({ ...form, children: Number(e.target.value) })}
              />
            </Field>
            <Field label='Infants'>
              <Input
                type='number'
                min={0}
                max={9}
                value={form.infants}
                onChange={(e) => setForm({ ...form, infants: Number(e.target.value) })}
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}
